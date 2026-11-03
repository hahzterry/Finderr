
import "dotenv/config";
import { createServer as createViteServer } from "vite";
import app from "./server";

const PORT = Number(process.env.PORT || 3000);

async function start() {
  const vite = await createViteServer({
    server: {
      middlewareMode: true
    },
    appType: "spa"
  });

  app.use(vite.middlewares);

  app.listen(PORT, "0.0.0.0", () => {
    console.log(
      `Billionder running at http://localhost:${PORT}`
    );
  });
}

start().catch((error) => {
  console.error("Server startup failed:", error);
  process.exit(1);
});
