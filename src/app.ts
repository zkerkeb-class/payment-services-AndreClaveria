import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import config from "./config";
import route from "./routes/index";
import { setupSwagger } from "./config/swagger.config";
import { logger } from "./utils/logger";
import { errorMiddleware } from "./middlewares/error.middleware";

const app: Application = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(
  morgan("combined", {
    stream: {
      write: (message: string) => logger.info(message.trim())
    }
  })
);

// Routes
app.use("/api", route);

setupSwagger(app);
app.get("/health", async (req: Request, res: Response) => {
  // Endpoint de health check simplifié - sera surveillé par le service de notification
  const status = {
    status: "UP",
    timestamp: new Date().toISOString(),
    service: config.discord.service_name
  };

  res.status(200).json(status);
});

// Error handling
app.use(errorMiddleware);

// Exporter l'application
export { app };
