import express, { Router } from "express";
import multer, { Multer } from "multer";
import path from "path";
const router: Router = express.Router();

import { authenticateToken } from "../Middleware/authMiddleware";
import {
    createProduct,
    getBestSelling,
    getMayLike,
    getProductImage,
    getProductDetails,
    getSectionProducts,
    getProductColors,
    getSearchedProducts,
    getSimilarProducts
} from "../controllers/productController";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.resolve(__dirname, "..", "uploads"));
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

export const upload: Multer = multer({ storage: storage });

// GET
router.get("/best-selling", getBestSelling);
router.get("/may-like", getMayLike);
router.get("/details/:productId", getProductDetails);
router.get("/section-products/:sectionType", getSectionProducts);
router.get("/colors/:sectionType", getProductColors);
router.get("/search/:query", getSearchedProducts);
router.get("/similar/:productId", getSimilarProducts);
router.get("/image/:productId", getProductImage);

// POST
router.post("/create", authenticateToken, upload.single("file"), createProduct);

export default router;