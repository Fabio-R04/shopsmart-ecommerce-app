import mongoose, { Schema, Document } from "mongoose";
import { IProduct } from "./productModel";

export interface IUser extends Document {
    _id: string;
    fullName: string;
    email: string;
    password: string;
    isAdmin: boolean;
    createdAt: Date;
}

const authSchema: Schema = new Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: false, default: false }
}, {
    timestamps: true
});

export default mongoose.model<IUser>("User", authSchema);