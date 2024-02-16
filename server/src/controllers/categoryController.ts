import { Request, Response } from "express";
import CategoryM, { ICategory } from "../models/categoryModel";

// GET
export const getCategories = async (req: Request, res: Response) => {
    try {
        const categories: ICategory[] = await CategoryM.find({});
        return res.status(200).json(categories);
    } catch (error) {
        return res.status(400).json({
            error: "Failed to fetch categories."
        });
    }
}

// POST
export const createCategory = async (req: Request, res: Response) => {
    const categoryName: string = `${req.body.categoryName[0].toUpperCase()}${req.body.categoryName.slice(1).toLowerCase()}`;

    if (!categoryName) {
        return res.status(400).json({
            error: "Don't leave empty fields"
        });
    }

    const alreadyExists = await CategoryM.exists({
        name: categoryName
    });

    if (alreadyExists) {
        return res.status(400).json({
            error: `Category with name '${categoryName}' already exists`
        });
    }

    try {
        const newCategory: ICategory = await CategoryM.create({
            name: categoryName
        });

        return res.status(201).json(newCategory);
    } catch (error) {
        return res.status(400).json({
            error: "Failed to create category, please try again."
        });
    }
}