// Local development server: API + Vite middleware on one port.
// Production on Vercel uses api/index.ts + the static Vite build instead.
import "dotenv/config";
import { createServer as createViteServer } from "vite";
import { createApp } from "./server/app.js";

const PORT = Number(process.env.PORT || 3000);

async function start() {
  const app = createApp();
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Portfolio dev server running on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start dev server:", err);
  process.exit(1);
});
