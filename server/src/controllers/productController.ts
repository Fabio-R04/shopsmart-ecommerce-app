import { Request, Response } from "express";
import ProductM, { IProduct } from "../models/productModel";
import { Readable } from "stream";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";

// GET
export const getBestSelling = async (req: Request, res: Response) => {
    try {
        const products: IProduct[] = await ProductM.find({})
            .select("-productImage")
            .sort({ productStock: 1 })
            .limit(4);
        
        return res.status(200).json(products);
    } catch (error) {
        return res.status(400).json({
            error: "Failed to fetch best selling products."
        });
    }
}

export const getMayLike = async (req: Request, res: Response) => {
    try {
        const products: IProduct[] = await ProductM.find({})
            .select("-productImage")
            .sort({ productStock: -1 })
            .limit(4);

        return res.status(200).json(products);
    } catch (error) {
        return res.status(400).json({
            error: "Failed to fetch products you may like."
        });
    }
}

export const getProductDetails = async (req: Request, res: Response) => {
    const productId: string = req.params.productId;

    try {
        const product: IProduct = await ProductM.findById(productId)
            .populate({
                path: "reviews",
                model: "Review",
                populate: {
                    path: "user",
                    model: "User",
                    select: "-password"
                }
            })
            .select("-productImage");
        return res.status(200).json(product);
    } catch (error) {
        return res.status(400).json({
            error: "Failed to fetch product details."
        });
    }
}

export const getSectionProducts = async (req: Request, res: Response) => {
    const sectionType: string = req.params.sectionType;

    try {
        const products: IProduct[] = await ProductM.find({
            productCategory: `${sectionType[0].toUpperCase()}${sectionType.slice(1, sectionType.length).toLowerCase()}`
        }).select("-productImage");

        return res.status(200).json(products);
    } catch (error) {
        return res.status(400).json({
            error: "Failed to fetch section products."
        });
    }
}

export const getProductColors = async (req: Request, res: Response) => {
    const sectionType: string = req.params.sectionType;

    if (sectionType.trim() === "undefined") {
        const productColors: string[] = await ProductM.distinct("productColor");
        return res.status(200).json(productColors);
    }

    try {
        const productColors: any[] = await ProductM.aggregate([
            {
                $match: {
                    productCategory: `${sectionType[0].toUpperCase()}${sectionType.slice(1, sectionType.length).toLowerCase()}`
                }
            },
            {
                $group: {
                    _id: null,
                    colors: { $addToSet: "$productColor" }
                }
            },
            {
                $project: {
                    _id: 0,
                    colors: 1
                }
            }
        ]);

        return res.status(200).json(productColors.length > 0 ? (
            productColors[0].colors
        ) : (
            []
        ));
    } catch (error) {
        return res.status(400).json({
            error: "Failed to fetch product colors."
        });
    }
}

export const getSearchedProducts = async (req: Request, res: Response) => {
    const query: string = req.params.query;

    if (query.trim() === "") {
        return res.status(400).json({
            error: "No search query provided."
        });
    }

    try {
        const searchedProducts: IProduct[] = await ProductM.find({})
            .select("-productImage"); 
        
        const filteredProducts: IProduct[] = searchedProducts.filter((product) => {
            return product.productName.toLowerCase().includes(query.toLowerCase());
        });

        return res.status(200).json(filteredProducts);
    } catch (error) {
        return res.status(400).json({
            error: "Failed to fetch products."
        });
    }
}

export const getSimilarProducts = async (req: Request, res: Response) => {
    const productId: string = req.params.productId;

    try {
        const product: IProduct | null = await ProductM.findById(productId);

        if (!product) {
            return res.status(400).json({
                error: "Product doesn't exist."
            });
        }

        const similarProducts: IProduct[] = await ProductM.aggregate([
            {
                $match: {
                    _id: { $ne: product._id },
                    productCategory: product.productCategory
                }
            },
            {
                $project: {
                    productImage: 0
                }
            },
            {
                $sample: { size: 4 }
            }
        ]);

        return res.status(200).json(similarProducts);
    } catch (error) {
        return res.status(400).json({
            error: "Failed to fetch similar products."
        });
    }
}

export const getProductImage = async (req: Request, res: Response) => {
    const productId: string = req.params.productId;

    try {
        const product: IProduct | null = await ProductM.findById(productId);

        if (!product) {
            return res.status(400).json({
                error: "Image not found."
            });
        }

        const imageStream = new Readable();
        imageStream.push(product.productImage.data);
        imageStream.push(null);

        res.setHeader("Content-Type", product.productImage.contentType);
        imageStream.pipe(res);
    } catch (error) {
        return res.status(500).json({
            error: "Server Error"
        });
    }
}

// POST
export const createProduct = async (req: Request, res: Response) => {
    const {
        productName,
        productDescription,
        productPrice,
        productStock,
        productColor,
        productCategory,
    } = req.body;

    if (!productName || !productDescription || !productPrice || !productStock || !productColor || !productCategory) {
        return res.status(400).json({
            error: "Don't leave empty fields."
        });
    }

    if (req.file) {
        if (req.file.size > 20971520) {
            return res.status(400).json({ error: "This image exceeds size limit (20MB)" });
        }
    } else {
        return res.status(400).json({
            error: "No image provided"
        });
    }

    try {
        const newProduct: IProduct = await ProductM.create({
            productName,
            productDescription,
            productPrice,
            productStock,
            productColor,
            productCategory,
            productImage: {
                data: fs.readFileSync(path.resolve(__dirname, "..", "uploads") + `\\${req.file.filename}`),
                contentType: req.file.mimetype
            }
        });

        return res.status(201).json({
            success: "Product Created"
        });
    } catch (error) {
        return res.status(400).json({
            error: "Failed to create product."
        });
    }
}