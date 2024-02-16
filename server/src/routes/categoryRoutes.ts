import express, { Router } from "express";
const router: Router = express.Router();

import { authenticateToken } from "../Middleware/authMiddleware";
import { createCategory, getCategories } from "../controllers/categoryController";

// GET
router.get("/categories", authenticateToken, getCategories);

// POST
router.post("/create", authenticateToken, createCategory);

export default router;