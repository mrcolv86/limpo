import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { seed } from "./seed";
import fs from "fs";
import path from "path";

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

app.use((req, res, next) => {
  const start = Date.now();
  const requestPath = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (requestPath.startsWith("/api")) {
      let logLine = `${req.method} ${requestPath} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      console.log(`${new Date().toLocaleTimeString()} [express] ${logLine}`);
    }
  });

  next();
});

function serveStatic(app: express.Express) {
  const distPath = path.resolve(process.cwd(), "dist", "public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}

(async () => {
  try {
    await seed();
    console.log("Seed do banco de dados concluído com sucesso!");
  } catch (error) {
    console.error("Erro ao executar seed do banco de dados:", error);
  }
  
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // Serve static files in production
  serveStatic(app);

  // Use Railway's PORT environment variable or fallback to 5000
  const port = process.env.PORT ? parseInt(process.env.PORT) : 5000;
  
  server.listen(port, "0.0.0.0", () => {
    console.log(`${new Date().toLocaleTimeString()} [express] 🚀 BierServ server running on port ${port}`);
    console.log(`${new Date().toLocaleTimeString()} [express] 🌍 Environment: ${process.env.NODE_ENV || 'production'}`);
    console.log(`${new Date().toLocaleTimeString()} [express] 🗄️ Database: ${process.env.DATABASE_URL ? 'Connected' : 'Not configured'}`);
  });
})();