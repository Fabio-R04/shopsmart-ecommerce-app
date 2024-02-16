import { Request, Response } from "express";
import UserM, { IUser } from "../models/authModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// REUSEABLE
const genToken = (id: string): string => {
    const jwtSecret: string = `${process.env.JWT_SECRET}`;
    return jwt.sign({ id }, jwtSecret, { expiresIn: "24h" });
}

// GET
export const getAdminUsers = async (req: Request, res: Response) => {
    const isAdmin: boolean = req.user.isAdmin;
    if (!isAdmin) {
        return res.status(403).json({
            error: "Not Authorized"
        });
    }

    try {
        const users: IUser[] = await UserM.find({})
            .select("-password");

        return res.status(200).json(users);
    } catch (error) {
        return res.status(400).json({
            error: "Failed to fetch admin users."
        });
    }
}

// POST
export const register = async (req: Request, res: Response) => {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
        return res.status(400).json({
            error: "Don't leave empty fields."
        });
    }

    const alreadyExists = await UserM.exists({ email });

    if (alreadyExists) {
        return res.status(400).json({
            error: `User with email '${email}' already exists.`
        });
    }

    try {
        const salt: string = await bcrypt.genSalt(10);
        const hashedPassword: string = await bcrypt.hash(password, salt);

        const newUser: IUser = await UserM.create({
            fullName,
            email,
            password: hashedPassword
        });

        return res.status(201).json({
            _id: newUser?._id,
            fullName: newUser?.fullName,
            email: newUser?.email,
            isAdmin: newUser?.isAdmin,
            token: genToken(newUser?._id)
        });
    } catch (error) {
        return res.status(400).json({
            error: "Something went wrong, please try again."
        });
    }
}

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            error: "Don't leave empty fields."
        });
    }

    try {
        const user: IUser | null = await UserM.findOne({ email });

        if (user && (await bcrypt.compare(password, user?.password))) {
            return res.status(200).json({
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                isAdmin: user.isAdmin,
                token: genToken(user._id)
            });
        }

        return res.status(400).json({
            error: "Email or password incorrect."
        });
    } catch (error) {
        return res.status(400).json({
            error: "Something went wrong, please try again."
        });
    }
}

// PUT
export const changeAccountDetails = async (req: Request, res: Response) => {
    const { fullName, email } = req.body;

    if (!fullName || !email) {
        return res.status(400).json({
            error: "Don't leave empty fields."
        });
    }

    try {
        const user: IUser = await UserM.findById(req.user._id)
            .select("-password") as IUser;

        user.fullName = fullName;
        user.email = email;

        await user.save();
        return res.status(200).json(user);
    } catch (error) {
        return res.status(400).json({
            error: "Failed to change account details."
        });
    }
}