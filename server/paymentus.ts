
/**
 * PayBills.rent — Paymentus Integration
 * Server-side only
 */

export type PaymentusStatus = {
  connected: boolean;
  status: "disabled" | "not_configured" | "ready";
};

export function getPaymentusStatus(): PaymentusStatus {
  if (process.env.PAYMENTUS_ENABLED !== "true") {
    return {
      connected: false,
      status: "disabled",
    };
  }

  const configured = [
    process.env.PAYMENTUS_BASE_URL,
    process.env.PAYMENTUS_PRESHARED_KEY,
    process.env.PAYMENTUS_TLA,
  ].every(Boolean);

  return {
    connected: false,
    status: configured ? "ready" : "not_configured",
  };
}

export async function getPaymentusToken(): Promise<string> {
  if (process.env.PAYMENTUS_ENABLED !== "true") {
    throw new Error("Paymentus integration is disabled");
  }

  const {
    PAYMENTUS_BASE_URL,
    PAYMENTUS_PRESHARED_KEY,
    PAYMENTUS_TLA,
  } = process.env;

  if (
    !PAYMENTUS_BASE_URL ||
    !PAYMENTUS_PRESHARED_KEY ||
    !PAYMENTUS_TLA
  ) {
    throw new Error("Missing Paymentus credentials");
  }

  throw new Error(
    "Paymentus authentication requires the approved partner SDK configuration."
  );
}
