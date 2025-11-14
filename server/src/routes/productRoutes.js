import express from "express";
import { getAllProducts, getProductBySku } from "../controllers/productController.js";

const router = express.Router();

// GET /api/products?q=nombre
router.get("/", getAllProducts);

// GET /api/products/:sku
router.get("/:sku", getProductBySku);

export default router;
