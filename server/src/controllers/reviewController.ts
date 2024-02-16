import { Request, Response } from "express";
import ReviewM, { IReview } from "../models/reviewModel";
import ProductM, { IProduct } from "../models/productModel";
import OrderM, { IOrder } from "../models/orderModel";

// POST
export const createReview = async (req: Request, res: Response) => {
    try {
        const { productId, description, rating } = req.body;
        const currentUserId: string = req.user._id;

        if (!productId || !rating || !description) {
            return res.status(400).json({
                error: "Don't leave empty fields."
            });
        }

        const exists = await ReviewM.exists({
            user: currentUserId,
            product: productId
        });

        if (exists) {
            return res.status(400).json({
                error: "You already reviewed this product."
            });
        }

        const product: IProduct = await ProductM.findById(productId)
            .select("-productImage");

        if (!product) {
            return res.status(400).json({
                error: "Product not found."
            });
        }

        const orders: IOrder[] = await OrderM.find({
            user: currentUserId
        });

        if (orders.length < 1) {
            return res.status(400).json({
                error: "You haven't purchased this product."
            });
        }

        const productPurchased: boolean = orders.some((order: IOrder): boolean => {
            if (order.products.some((product): boolean => {
                if (product.details.toString() === productId.toString()) {
                    return true;
                }
                return false;
            })) {
                return true;
            }
            return false;
        });

        if (!productPurchased) {
            return res.status(400).json({
                error: "You haven't purchased this product."
            });
        }

        const newReview: IReview = await ReviewM.create({
            user: currentUserId,
            product: productId,
            rating,
            description
        });

        await newReview.populate({
            path: "user",
            model: "User",
            select: "-password"
        });

        (product.reviews as string[]).push(newReview._id);
        await product.populate({
            path: "reviews",
            model: "Review"
        });

        const reviewRatingSum: number = (product.reviews as IReview[]).reduce((a: number, review: IReview): number => {
            return a + review.rating;
        }, 0);
        const average: number = reviewRatingSum / product.reviews.length;

        product.rating = average;
        await product.save();

        return res.status(201).json(newReview);
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            error: "Failed to create review."
        });
    }
}

// PUT
export const likeReview = async (req: Request, res: Response) => {
    const reviewId: string = req.params.reviewId;

    try {
        const review: IReview | null = await ReviewM.findById(reviewId);

        if (review) {
            const alreadyLiked: boolean = review.likes.some((userId) => {
                if (userId.toString() === req.user._id.toString()) {
                    return true;
                }
                return false;
            });

            const alreadyDisliked: boolean = review.dislikes.some((userId) => {
                if (userId.toString() === req.user._id.toString()) {
                    return true;
                }
                return false;
            });

            if (alreadyLiked) {
                const updatedLikes: string[] = review.likes.filter((userId: string) => {
                    return userId.toString() !== req.user._id.toString();
                });

                review.likes = updatedLikes;
                await review.save();

                return res.status(200).json({
                    reviewId,
                    likes: review.likes,
                    dislikes: review.dislikes
                });
            }

            if (alreadyDisliked) {
                const updatedDislikes: string[] = review.dislikes.filter((userId: string) => {
                    return userId.toString() !== req.user._id.toString();
                });

                review.dislikes = updatedDislikes;
            }

            review.likes.push(req.user._id);
            await review.save();

            return res.status(200).json({
                reviewId,
                likes: review.likes,
                dislikes: review.dislikes
            });
        }

        return res.status(400).json({
            error: "Review doesn't exist."
        });
    } catch (error) {
        return res.status(400).json({
            error: "Failed to like review."
        });
    }
}

export const dislikeReview = async (req: Request, res: Response) => {
    const reviewId: string = req.params.reviewId;

    try {
        const review: IReview | null = await ReviewM.findById(reviewId);

        if (review) {
            const alreadyLiked: boolean = review.likes.some((userId) => {
                if (userId.toString() === req.user._id.toString()) {
                    return true;
                }
                return false;
            });

            const alreadyDisliked: boolean = review.dislikes.some((userId) => {
                if (userId.toString() === req.user._id.toString()) {
                    return true;
                }
                return false;
            });

            if (alreadyDisliked) {
                const updatedDislikes: string[] = review.dislikes.filter((userId: string) => {
                    return userId.toString() !== req.user._id.toString();
                });

                review.dislikes = updatedDislikes;
                await review.save();

                return res.status(200).json({
                    reviewId,
                    likes: review.likes,
                    dislikes: review.dislikes
                });
            }

            if (alreadyLiked) {
                const updatedLikes: string[] = review.likes.filter((userId: string) => {
                    return userId.toString() !== req.user._id.toString();
                });

                review.likes = updatedLikes;
            }

            review.dislikes.push(req.user._id);
            await review.save();

            return res.status(200).json({
                reviewId,
                likes: review.likes,
                dislikes: review.dislikes
            });
        }

        return res.status(400).json({
            error: "Review doesn't exist."
        });
    } catch (error) {
        return res.status(400).json({
            error: "Failed to like review."
        });
    }
}