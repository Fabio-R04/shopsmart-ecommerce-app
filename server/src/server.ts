import { config } from "dotenv";
config();
import express, { Application } from "express";
import mongoose from "mongoose";
import cors from "cors";
// Import Routes
import authRoutes from "./routes/authRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import productRoutes from "./routes/productRoutes";
import orderRoutes from "./routes/orderRoutes";
import reviewRoutes from "./routes/reviewRoutes";

const app: Application = express();
const clientURL: string = `${process.env.CLIENT_URL}`;

// Express Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: clientURL,
    credentials: true
}));

// Routes Middleware
app.use("/auth", authRoutes);
app.use("/category", categoryRoutes);
app.use("/product", productRoutes);
app.use("/order", orderRoutes);
app.use("/review", reviewRoutes);

// Database Connection
const port: number = Number(process.env.PORT);
const uri: string = `${process.env.MONGO_URI}`;

(async () => {
    try {
        await mongoose.connect(uri);
        console.log("MongoDB Connected");

        app.listen(port, () => {
            console.log(`Server listening on port: ${port}`);
        });
    } catch (error) {
        console.log(`Error: ${error}`);
    }
})();