import express, { Router } from "express";
const router: Router = express.Router();

import { authenticateToken } from "../Middleware/authMiddleware";
import {
    createReview,
    likeReview,
    dislikeReview
} from "../controllers/reviewController";

// POST
router.post("/create", authenticateToken, createReview);

// PUT
router.put("/like/:reviewId", authenticateToken, likeReview);
router.put("/dislike/:reviewId", authenticateToken, dislikeReview);

export default router;