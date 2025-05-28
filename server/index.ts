import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { log } from "./vite";

let serveStatic: any = () => {};
let setupVite: any = () => {};
import { seed } from "./seed";

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

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
  // Executar o seed do banco de dados antes de iniciar o servidor
  try {
    if (process.env.NODE_ENV === "production") {
    try {
      const { push } = await import("drizzle-kit");
      await push();
      console.log("Migrações aplicadas com sucesso.");
    } catch (err) {
      console.error("Erro ao aplicar migrações:", err);
    }
  }

  await seed();

    console.log("Seed do banco de dados concluído com sucesso!");
  } catch (error) {
    console.error("Erro ao executar seed do banco de dados:", error);
  }
  
  if (process.env.NODE_ENV === "development") {
    const vite = await import("./vite");
    setupVite = vite.setupVite;
    setupVite(app);
} else {
    const vite = await import("./vite");
    serveStatic = vite.serveStatic;
    serveStatic(app);
}

const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Use Railway's PORT environment variable or fallback to 5000 for development
  const port = process.env.PORT ? parseInt(process.env.PORT) : 5000;
  
  server.listen(port, "0.0.0.0", () => {
    log(`🚀 BierServ server running on port ${port}`);
    log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    log(`🗄️ Database: ${process.env.DATABASE_URL ? 'Connected' : 'Not configured'}`);
  });
})();
