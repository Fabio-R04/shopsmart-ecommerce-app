import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "../models/authModel";

export interface IReview extends Document {
    _id: string;
    user: IUser;
    product: string;
    rating: number;
    description: string;
    likes: string[];
    dislikes: string[];
    createdAt: Date;
}

const reviewSchema: Schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    rating: { type: Number, required: true },
    description: { type: String, required: true },
    likes: { type: [{
        type: Schema.Types.ObjectId, ref: "User"
    }], _id: false, default: [], required: false },
    dislikes: { type: [{
        type: Schema.Types.ObjectId, ref: "User"
    }], _id: false, default: [], required: false }
}, {
    timestamps: true
});

export default mongoose.model<IReview>("Review", reviewSchema);