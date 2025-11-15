import express from "express";
import cors from "cors";
import { router } from "./router/route";

const app = express();

// Parse JSON bodies
app.use(express.json());

// Enable CORS
app.use(cors());

// Routes
app.use("/api/v1", router);

export default app;
