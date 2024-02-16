import { Request, Response } from "express";
import OrderM, { IOrder, OrderStatus } from "../models/orderModel";
import Stripe from "stripe";
import { CartItem } from "../models/productModel";

const stripe: Stripe = new Stripe(`${process.env.STRIPE_SECRET}`, {
    apiVersion: "2022-11-15"
});

// GET
export const handlePaymentSuccess = async (req: Request, res: Response) => {
    const sessionId: string = req.params.sessionId;

    if (!sessionId) {
        return res.status(400).json({
            error: "ID not found."
        });
    }

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent as string);

        if (paymentIntent.status === "succeeded") {
            return res.status(200).json({
                success: "ID Accepted"
            });
        } else {
            return res.status(400).json({
                error: "ID Rejected"
            });
        }
    } catch (error) {
        return res.status(400).json({
            error: "Something went wrong."
        });
    }
}

export const getUserOrders = async (req: Request, res: Response) => {
    try {
        const orders: IOrder[] = await OrderM.find({
            user: req.user._id
        }).populate([
            {
                path: "user",
                model: "User",
                select: "-password"
            },
            {
                path: "products",
                populate: {
                    path: "details",
                    model: "Product",
                    select: "-productImage"
                }
            }
        ]).sort({ createdAt: -1 });

        return res.status(200).json(orders);
    } catch (error) {
        return res.status(400).json({
            error: "Failed to fetch orders."
        });
    }
}

export const getAdminOrders = async (req: Request, res: Response) => {
    try {
        const isAdmin: boolean = req.user.isAdmin;
        if (!isAdmin) {
            return res.status(403).json({
                error: "Not Authorized"
            });
        }

        const orders: IOrder[] = await OrderM.find({})
            .populate([
                {
                    path: "user",
                    model: "User",
                    select: "-password",
                },
                {
                    path: "products",
                    populate: {
                        path: "details",
                        model: "Product",
                        select: "-productImage"
                    }
                }
            ])
            .sort({ createdAt: -1 });

        return res.status(200).json(orders);
    } catch (error) {
        return res.status(400).json({
            errors: "Failed to fetch admin orders."
        });
    }
}

// POST
export const createCheckoutSession = async (req: Request, res: Response) => {
    const products: CartItem[] = req.body;

    if (!products) {
        return res.status(400).json({
            error: "Failed to checkout. Please add items to your cart."
        });
    }

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: products.map((product) => {
                return {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: product.productName
                        },
                        unit_amount: product.productPrice * 100
                    },
                    quantity: product.quantity
                }
            }),
            success_url: `${process.env.CLIENT_URL}/payment-success/{CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/cart`
        });

        return res.status(201).json({
            url: session.url,
        });
    } catch (error) {
        return res.status(400).json({
            error: "Failed to create session."
        });
    }
}

export const createOrder = async (req: Request, res: Response) => {
    const products: CartItem[] = req.body;
    const sessionId: string = req.params.sessionId;

    if (!products) {
        return res.status(400).json({
            error: "Products Not Found."
        });
    }

    const exists = await OrderM.exists({
        sessionId
    });

    if (exists) {
        return res.status(400).json({
            error: "Order already exists."
        });
    }

    try {
        const newOrder: IOrder = await OrderM.create({
            user: req.user._id,
            products: products.map((item) => {
                return {
                    details: item._id,
                    quantity: item.quantity
                }
            }),
            status: OrderStatus.PAID,
            sessionId
        });

        return res.status(201).json(newOrder);
    } catch (error) {
        return res.status(400).json({
            error: "Failed to create order."
        });
    }
}