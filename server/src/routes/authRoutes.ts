import express, { Router } from "express";
const router: Router = express.Router();

import { authenticateToken } from "../Middleware/authMiddleware";
import {
    register,
    login,
    changeAccountDetails,
    getAdminUsers
} from "../controllers/authController";

// GET
router.get("/admin-users", authenticateToken, getAdminUsers);

// POST
router.post("/register", register);
router.post("/login", login);

// PUT
router.put("/account-details", authenticateToken, changeAccountDetails);

export default router;