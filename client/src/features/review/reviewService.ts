import axios from "axios";
import { ReviewData } from "../../pages/Product";
import { URL, getConfig } from "../../reuseable";

// POST
const createReview = async (data: ReviewData, token: string) => {
    const response = await axios.post(
        `${URL}/review/create`,
        data,
        getConfig(token)
    );

    return response.data;
}

// PUT
const likeReview = async (reviewId: string, token: string) => {
    const response = await axios.put(
        `${URL}/review/like/${reviewId}`,
        undefined,
        getConfig(token)
    );

    return response.data;
}

const dislikeReview = async (reviewId: string, token: string) => {
    const response = await axios.put(
        `${URL}/review/dislike/${reviewId}`,
        undefined,
        getConfig(token)
    );

    return response.data;
}

const reviewService = {
    createReview,
    likeReview,
    dislikeReview
}

export default reviewService;