import express, { Router } from "express";
const router: Router = express.Router();

import { authenticateToken } from "../Middleware/authMiddleware";
import {
    createCheckoutSession,
    handlePaymentSuccess,
    createOrder,
    getUserOrders,
    getAdminOrders
} from "../controllers/orderController";

// GET
router.get("/check-payment/:sessionId", authenticateToken, handlePaymentSuccess);
router.get("/user-orders", authenticateToken, getUserOrders);
router.get("/admin-orders", authenticateToken, getAdminOrders);

// POST
router.post("/create-session", authenticateToken, createCheckoutSession);
router.post("/create/:sessionId", authenticateToken, createOrder);

export default router;