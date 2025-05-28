import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { qrRouter } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { seed } from "./seed";
import { execSync } from "child_process";

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }
      log(logLine);
    }
  });

  next();
});

(async () => {
  if (process.env.NODE_ENV === "production") {
    try {
      console.log("🔄 Executando migrações via drizzle-kit push...");
      execSync("npx drizzle-kit push", { stdio: "inherit" });
    } catch (err) {
      console.error("❌ Erro ao executar migrações:", err);
    }
  }

  try {
    await seed();
    console.log("✅ Seed executado com sucesso.");
  } catch (err) {
    console.error("❌ Erro ao executar seed:", err);
  }

  const server = await registerRoutes(app);
  app.use(qrRouter);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error("Unhandled error:", err);
    res.status(500).send("Internal server error");
  });
})();
