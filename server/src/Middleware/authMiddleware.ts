import { Request, Response, NextFunction } from "express";
import UserM, { IUser } from "../models/authModel";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface CustomRequest extends Request {
    user: IUser;
}

export const authenticateToken = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const authHeader: string | undefined = req.headers.authorization;
    const token: string | null = authHeader ? authHeader.split(" ")[1] : null;

    if (token == null) {
        return res.status(403).json({
            error: "Not Authorized"
        });
    }

    try {
        const { id } = jwt.verify(token, `${process.env.JWT_SECRET}`) as JwtPayload;
        req.user = await UserM.findById(id) as IUser;
        next();
    } catch (error) {
        return res.status(403).json({
            error: "Not Authorized"
        });
    }
}