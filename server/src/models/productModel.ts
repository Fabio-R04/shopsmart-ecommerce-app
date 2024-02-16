import mongoose, { Schema, Document } from "mongoose";
import { IReview } from "./reviewModel";

export interface IProduct extends Document {
    _id: string;
    productName: string;
    productDescription: string;
    productPrice: number;
    productStock: number;
    productColor: string;
    productCategory: string;
    productImage: {
        data: Schema.Types.Buffer;
        contentType: string;
    };
    rating: number;
    reviews: string[] | IReview[];
    createdAt: Date;
}

export interface CartItem {
    _id: string;
    productName: string;
    productDescription: string;
    productPrice: number;
    productStock: number;
    quantity: number;
}

const productSchema: Schema = new Schema({
    productName: { type: String, required: true },
    productDescription: { type: String, required: true },
    productPrice: { type: Number, required: true },
    productStock: { type: Number, required: true },
    productColor: { type: String, required: true },
    productCategory: { type: String, required: true },
    productImage: { type: {
        data: Buffer,
        contentType: String
    }, required: true, _id: false },
    rating: { type: Number, default: 0, required: false },
    reviews: { type: [{ type: Schema.Types.ObjectId, ref: "Review" }], default: [], required: false }
}, {
    timestamps: true
});

export default mongoose.model<IProduct>("Product", productSchema);