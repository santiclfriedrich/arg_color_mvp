import express from "express";
import { getProducts, getProductBySku } from "../controllers/productController.js";

const router = express.Router();

// GET /api/products?q=nombre
router.get("/", getProducts);

// GET /api/products/:sku
router.get("/:sku", getProductBySku);

export default router;
