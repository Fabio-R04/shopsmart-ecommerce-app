import mongoose, { Schema } from "mongoose";

export interface ICategory {
    _id: string;
    name: string;
}

const categorySchema: Schema = new Schema({
    name: { type: String, required: true, unique: true }
});

export default mongoose.model<ICategory>("Category", categorySchema);