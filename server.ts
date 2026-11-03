
import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { createServer as createViteServer } from "vite";
import Stripe from "stripe";
import "dotenv/config";

import {
  getPaymentusStatus,
} from "./server/paymentus";

// ============================================
// PAYBILLS.RENT — EXPRESS SERVER
// ============================================

const app = express();

const PORT = Number(process.env.PORT || 3000);

const APP_URL =
  process.env.APP_URL || `http://localhost:${PORT}`;

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

const PAYMENTUS_APPROVED =
  process.env.PAYMENTUS_APPROVED === "true";

// ============================================
// TYPES
// ============================================

type BillStatus =
  | "demo"
  | "pending_review"
  | "verified"
  | "funded"
  | "payment_pending"
  | "paid";

type BillCategory =
  | "Electric"
  | "Water"
  | "Internet"
  | "Rent"
  | "Medical"
  | "Other";

type Bill = {
  id: string;
  category: BillCategory;
  title: string;
  story: string;
  tiktokUrl?: string;
  amountCents: number;
  dueDate: string;
  status: BillStatus;
  billerName?: string;
  sponsorCount: number;
  createdAt?: string;
  verifiedAt?: string;
  paidAt?: string;
};

type PaymentRecord = {
  sessionId: string;
  billId: string;
  amountCents: number;
  currency: string;
  status: "paid" | "refunded";
  createdAt: string;
};

// ============================================
// DEMO BILLS
// ============================================

const samples: Bill[] = [
  {
    id: "demo-electric",
    category: "Electric",
    title: "Keep the lights on",
    story:
      "Example household electric bill. This is a demonstration card, not a real funding request.",
    amountCents: 18642,
    dueDate: "2026-11-12",
    status: "demo",
    sponsorCount: 0,
  },
  {
    id: "demo-water",
    category: "Water",
    title: "Help cover a water bill",
    story:
      "Example water utility bill to demonstrate the swipe experience.",
    amountCents: 9240,
    dueDate: "2026-11-18",
    status: "demo",
    sponsorCount: 0,
  },
  {
    id: "demo-internet",
    category: "Internet",
    title: "Keep a family connected",
    story:
      "Example home internet bill. No payment can be collected for this card.",
    amountCents: 7800,
    dueDate: "2026-11-22",
    status: "demo",
    sponsorCount: 0,
  },
];

// ============================================
// LOCAL DEVELOPMENT STORAGE
// ============================================

// IMPORTANT:
// JSON storage is for local development only.
// Production requires a transactional database.

const dataFile = path.join(
  process.cwd(),
  "paybills-dev-data.json"
);

const paymentFile = path.join(
  process.cwd(),
  "paybills-dev-payments.json"
);

function readJsonFile<T>(
  file: string,
  fallback: T
): T {
  try {
    if (!fs.existsSync(file)) {
      return fallback;
    }

    return JSON.parse(
      fs.readFileSync(file, "utf8")
    ) as T;
  } catch (error) {
    console.error("Storage read error:", error);
    return fallback;
  }
}

function writeJsonFile<T>(
  file: string,
  data: T
): void {
  const temporaryFile = `${file}.${crypto.randomUUID()}.tmp`;

  fs.writeFileSync(
    temporaryFile,
    JSON.stringify(data, null, 2),
    { mode: 0o600 }
  );

  fs.renameSync(temporaryFile, file);
}

function readBills(): Bill[] {
  const stored = readJsonFile<Bill[]>(
    dataFile,
    []
  );

  return [...samples, ...stored];
}

function saveBills(bills: Bill[]): void {
  writeJsonFile(
    dataFile,
    bills.filter(
      (bill) => bill.status !== "demo"
    )
  );
}

function readPayments(): PaymentRecord[] {
  return readJsonFile<PaymentRecord[]>(
    paymentFile,
    []
  );
}

// ============================================
// SECURITY HELPERS
// ============================================

function cleanText(
  value: unknown,
  maxLength: number
): string {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().slice(0, maxLength);
}

function isValidDate(
  value: unknown
): value is string {
  if (
    typeof value !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(value)
  ) {
    return false;
  }

  const parsed = new Date(
    `${value}T00:00:00Z`
  );

  return (
    !Number.isNaN(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === value
  );
}

function isValidAmount(
  value: unknown
): boolean {
  const amount = Number(value);

  const cents = Math.round(amount * 100);

  return (
    value !== null &&
    value !== undefined &&
    value !== "" &&
    Number.isFinite(amount) &&
    Number.isSafeInteger(cents) &&
    cents >= 100 &&
    cents <= 1000000
  );
}

function publicBill(bill: Bill) {
  const {
    billerName,
    ...safeBill
  } = bill;

  return safeBill;
}

// ============================================
// STRIPE WEBHOOK
// MUST BE BEFORE express.json()
// ============================================

app.post(
  "/api/stripe/webhook",
  express.raw({
    type: "application/json",
  }),
  async (
    req: Request,
    res: Response
  ) => {
    if (
      !stripe ||
      !process.env.STRIPE_WEBHOOK_SECRET
    ) {
      return res.status(503).send(
        "Stripe webhook is not configured"
      );
    }

    const signature =
      req.headers["stripe-signature"];

    if (typeof signature !== "string") {
      return res.status(400).send(
        "Missing Stripe signature"
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (error) {
      console.error(
        "Stripe webhook signature error:",
        error
      );

      return res.status(400).send(
        "Invalid webhook signature"
      );
    }

    if (
      event.type ===
        "checkout.session.completed" ||
      event.type ===
        "checkout.session.async_payment_succeeded"
    ) {
      const session =
        event.data.object as Stripe.Checkout.Session;

      if (session.payment_status !== "paid") {
        return res.json({
          received: true,
          status: "awaiting_payment",
        });
      }

      const billId = session.metadata?.billId;

      if (!billId) {
        console.error(
          "Stripe session missing bill ID",
          session.id
        );

        return res.status(400).json({
          error: "Missing bill reference",
        });
      }

      const bill = readBills().find(
        (item) => item.id === billId
      );

      if (!bill || bill.status === "demo") {
        console.error(
          "Invalid bill in Stripe webhook",
          billId
        );

        return res.status(400).json({
          error: "Invalid bill reference",
        });
      }

      if (
        session.amount_total !== bill.amountCents ||
        session.currency?.toLowerCase() !== "usd"
      ) {
        console.error(
          "Stripe payment amount mismatch",
          session.id
        );

        return res.status(400).json({
          error: "Payment amount mismatch",
        });
      }

      const payments = readPayments();

      const alreadyProcessed = payments.some(
        (payment) =>
          payment.sessionId === session.id
      );

      if (!alreadyProcessed) {
        payments.push({
          sessionId: session.id,
          billId,
          amountCents: session.amount_total,
          currency: "usd",
          status: "paid",
          createdAt:
            new Date().toISOString(),
        });

        writeJsonFile(
          paymentFile,
          payments
        );

        console.info(
          "Sponsor payment recorded:",
          {
            sessionId: session.id,
            billId,
            amountCents: session.amount_total,
          }
        );
      }

      // IMPORTANT:
      // Do not initiate Paymentus disbursement here.
      // Production requires settlement confirmation,
      // bill revalidation, fraud review, and an
      // approved Paymentus payment agreement.

      return res.json({
        received: true,
        status: "recorded",
      });
    }

    return res.json({
      received: true,
    });
  }
);

// ============================================
// JSON MIDDLEWARE
// ============================================

app.use(
  express.json({
    limit: "32kb",
  })
);

// ============================================
// HEALTH CHECK
// ============================================

app.get(
  "/api/health",
  (_req: Request, res: Response) => {
    const paymentus =
      getPaymentusStatus();

    return res.json({
      status: "ok",
      application: "PayBills.rent",
      mode: "prototype",
      stripeConfigured: Boolean(stripe),
      paymentus: paymentus.status,
      paymentusConnected:
        paymentus.connected,
      timestamp:
        new Date().toISOString(),
    });
  }
);

// ============================================
// PAYMENTUS STATUS
// ============================================

// Do not expose credentials or authentication
// tokens through this endpoint.

app.get(
  "/api/paymentus/status",
  (_req: Request, res: Response) => {
    const status =
      getPaymentusStatus();

    return res.json({
      provider: "Paymentus",
      connected: status.connected,
      status: status.status,
      approved: PAYMENTUS_APPROVED,
      paymentExecutionEnabled: false,
    });
  }
);

// ============================================
// GET PUBLIC BILLS
// ============================================

app.get(
  "/api/bills",
  (_req: Request, res: Response) => {
    const bills = readBills()
      .filter(
        (bill) =>
          bill.status === "demo" ||
          bill.status === "verified"
      )
      .map(publicBill);

    return res.json({
      bills,
      total: bills.length,
    });
  }
);

// ============================================
// SUBMIT A BILL
// ============================================

app.post(
  "/api/bills",
  (
    req: Request,
    res: Response
  ) => {
    const {
      category,
      title,
      story,
      tiktokUrl,
      videoConsent,
      amount,
      dueDate,
      billerName,
    } = req.body || {};

    const allowedCategories: BillCategory[] = [
      "Electric",
      "Water",
      "Internet",
      "Rent",
      "Medical",
      "Other",
    ];

    if (
      !allowedCategories.includes(category)
    ) {
      return res.status(400).json({
        error: "Invalid bill category",
      });
    }

    if (
      typeof title !== "string" ||
      !title.trim() ||
      title.length > 100 ||
      typeof story !== "string" ||
      story.length > 500 ||
      typeof billerName !== "string" ||
      !billerName.trim() ||
      billerName.length > 120
    ) {
      return res.status(400).json({
        error: "Invalid bill information",
      });
    }

    // Only accept canonical public TikTok video URLs. No shorteners or arbitrary hosts.
    let safeTikTokUrl: string | undefined;
    if (tiktokUrl !== undefined && tiktokUrl !== "") {
      if (typeof tiktokUrl !== "string" || tiktokUrl.length > 300 || videoConsent !== true) {
        return res.status(400).json({error:"TikTok video consent and a valid URL are required"});
      }
      try {
        const u = new URL(tiktokUrl);
        if (u.protocol !== "https:" || !["tiktok.com", "www.tiktok.com", "m.tiktok.com"].includes(u.hostname) || !/^\/@[\w.]+\/video\/\d{15,25}\/?$/.test(u.pathname)) throw new Error("invalid");
        safeTikTokUrl = `https://www.tiktok.com${u.pathname.replace(/\/$/, "")}`;
      } catch {
        return res.status(400).json({error:"Enter a full public TikTok video URL"});
      }
    }
    if (!story.trim() && !safeTikTokUrl) return res.status(400).json({error:"Add a written story or a TikTok video"});

    if (!isValidDate(dueDate)) {
      return res.status(400).json({
        error: "Invalid due date",
      });
    }

    if (!isValidAmount(amount)) {
      return res.status(400).json({
        error:
          "Bill amount must be between $1 and $10,000",
      });
    }

    const amountCents =
      Math.round(Number(amount) * 100);

    const bill: Bill = {
      id: crypto.randomUUID(),
      category,
      title: cleanText(title, 100),
      story: cleanText(story, 500),
      ...(safeTikTokUrl ? {tiktokUrl: safeTikTokUrl} : {}),
      amountCents,
      dueDate,
      billerName: cleanText(
        billerName,
        120
      ),
      status: "pending_review",
      sponsorCount: 0,
      createdAt:
        new Date().toISOString(),
    };

    const bills = readBills();

    bills.push(bill);

    saveBills(bills);

    return res.status(201).json({
      id: bill.id,
      status: bill.status,
      message:
        "Bill submitted for independent verification.",
    });
  }
);

// ============================================
// STRIPE SPONSOR CHECKOUT
// ============================================

app.post(
  "/api/checkout",
  async (
    req: Request,
    res: Response
  ) => {
    const { billId } = req.body || {};

    if (
      typeof billId !== "string"
    ) {
      return res.status(400).json({
        error: "Invalid bill ID",
      });
    }

    const bill = readBills().find(
      (item) => item.id === billId
    );

    if (
      !bill ||
      bill.status !== "verified"
    ) {
      return res.status(409).json({
        error:
          "Only verified bills can receive sponsorship.",
      });
    }

    if (!PAYMENTUS_APPROVED) {
      return res.status(503).json({
        error:
          "Bill sponsorship is not enabled. Paymentus partner approval is required.",
      });
    }

    if (!stripe) {
      return res.status(503).json({
        error:
          "Stripe is not configured.",
      });
    }

    try {
      const session =
        await stripe.checkout.sessions.create(
          {
            mode: "payment",

            payment_method_types: [
              "card",
            ],

            line_items: [
              {
                price_data: {
                  currency: "usd",
                  unit_amount:
                    bill.amountCents,
                  product_data: {
                    name:
                      `Sponsor ${bill.category} bill`,
                    description:
                      "Verified bill sponsorship subject to approved settlement terms.",
                  },
                },
                quantity: 1,
              },
            ],

            success_url:
              `${APP_URL}/?checkout=success&session_id={CHECKOUT_SESSION_ID}`,

            cancel_url:
              `${APP_URL}/?checkout=cancelled`,

            metadata: {
              billId: bill.id,
              application:
                "PayBills.rent",
            },

            payment_intent_data: {
              metadata: {
                billId: bill.id,
              },
            },
          },
          {
            idempotencyKey:
              `sponsor-${bill.id}-${crypto.randomUUID()}`,
          }
        );

      if (!session.url) {
        return res.status(502).json({
          error:
            "Stripe did not return a checkout URL",
        });
      }

      return res.json({
        url: session.url,
        sessionId: session.id,
      });
    } catch (error) {
      console.error(
        "Stripe checkout error:",
        error
      );

      return res.status(502).json({
        error:
          "Unable to initialize checkout",
      });
    }
  }
);

// ============================================
// PAYMENTUS INTEGRATION PLACEHOLDERS
// ============================================

// These endpoints intentionally do not execute
// biller transactions.
//
// Implement after receiving:
// - Paymentus partner approval
// - Sandbox credentials
// - Biller discovery documentation
// - Account verification documentation
// - Payment execution documentation
// - Settlement and reconciliation requirements

app.post(
  "/api/paymentus/verify-bill",
  (_req: Request, res: Response) => {
    return res.status(503).json({
      success: false,
      provider: "Paymentus",
      status: "not_available",
      message:
        "Live bill verification requires approved Paymentus API access.",
    });
  }
);

app.post(
  "/api/paymentus/pay-bill",
  (_req: Request, res: Response) => {
    return res.status(503).json({
      success: false,
      provider: "Paymentus",
      status: "disabled",
      message:
        "Direct biller payments are disabled until Paymentus settlement integration and approval are complete.",
    });
  }
);

// ============================================
// GLOBAL ERROR HANDLER
// ============================================

app.use(
  (
    error: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    console.error(
      "PayBills.rent server error:",
      error
    );

    return res.status(500).json({
      error: "Internal server error",
    });
  }
);

// ============================================
// VITE / PRODUCTION SERVER
// ============================================

async function start() {
  if (
    process.env.NODE_ENV !== "production"
  ) {
    const vite =
      await createViteServer({
        server: {
          middlewareMode: true,
        },
        appType: "spa",
      });

    app.use(vite.middlewares);
  } else {
    const distPath = path.join(
      process.cwd(),
      "dist"
    );

    app.use(
      express.static(distPath)
    );

    app.use(
      (
        req: Request,
        res: Response,
        next: NextFunction
      ) => {
        if (
          req.path.startsWith("/api/")
        ) {
          return next();
        }

        return res.sendFile(
          path.join(
            distPath,
            "index.html"
          )
        );
      }
    );
  }

  app.listen(
    PORT,
    "0.0.0.0",
    () => {
      console.log(
        `PayBills.rent running on port ${PORT}`
      );

      console.log(
        "Paymentus:",
        getPaymentusStatus().status
      );

      console.log(
        "Stripe:",
        stripe
          ? "configured"
          : "not configured"
      );
    }
  );
}

start().catch((error) => {
  console.error(
    "Server startup failed:",
    error
  );

  process.exit(1);
});
