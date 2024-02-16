import { IUser } from "../auth/authInterfaces";

export interface IReview {
    _id: string;
    user: IUser;
    product: string;
    rating: number;
    description: string;
    likes: string[];
    dislikes: string[];
    createdAt: Date;
}

export interface ReviewState {
    successReview: boolean;
    errorReview: boolean;
    loadingReviewCreation: boolean;
    messageReview: string;
}