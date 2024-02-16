import mongoose, { Schema } from "mongoose";
import { IUser } from "./authModel";
import { IProduct } from "./productModel";

export enum OrderStatus {
    PAID = "paid",
    SHIPPED = "shipped",
    ARRIVED = "arrived",
}

export interface IOrder {
    _id: string;
    user: IUser;
    products: {
        details: string | IProduct;
        quantity: number;
    }[];
    status: OrderStatus;
    sessionId: string;
    createdAt: Date;
}

const orderSchema: Schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    products: { type: [{
        details: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true }
    }], required: true, _id: false },
    status: { type: String, required: true },
    sessionId: { type: String, required: true, unique: true }
}, {
    timestamps: true
});

export default mongoose.model<IOrder>("Order", orderSchema);