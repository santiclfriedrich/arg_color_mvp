import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import productRoutes from "./routes/productRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ---------------- API ----------------
app.use("/api/products", productRoutes);

// ---------------- FRONTEND ----------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir build de React
app.use(
  express.static(path.join(__dirname, "../../client/dist"))
);

// Catch-all SPA (EXPRESS 5 COMPATIBLE)
app.get(/.*/, (req, res) => {
  res.sendFile(
    path.join(__dirname, "../../client/dist/index.html")
  );
});

export default app;
