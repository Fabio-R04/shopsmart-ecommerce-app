import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import reviewService from "./reviewService";
import { IReview, ReviewState } from "./reviewInterfaces";
import { ReviewData } from "../../pages/Product";
import { checkTokenValidity, throwError } from "../../reuseable";
import { logout } from "../auth/authSlice";

const initialState: ReviewState = {
    successReview: false,
    errorReview: false,
    loadingReviewCreation: false,
    messageReview: ""
}

// POST
export const createReview = createAsyncThunk("review/create", async (data: ReviewData, thunkAPI: any) => {
    try {
        const token: string | null = thunkAPI.getState().auth.user?.token ?? null;

        if (!token) {
            throwError(400, "Please sign in to add a review.");
        }

        return await reviewService.createReview(data, (token as string));
    } catch (error: any) {
        const message: string = error.response.data.error;

        if (!checkTokenValidity(error)) {
            thunkAPI.dispatch(logout());
            document.location.href = "/login";
        }

        return thunkAPI.rejectWithValue(message);
    }
});

// PUT
export const likeReview = createAsyncThunk("review/like", async (reviewId: string, thunkAPI: any) => {
    try {
        const token: string | null = thunkAPI.getState().auth.user?.token ?? null;
        return await reviewService.likeReview(reviewId, (token as string));
    } catch (error: any) {
        const message: string = error.response.data.error;

        if (!checkTokenValidity(error)) {
            thunkAPI.dispatch(logout());
            document.location.href = "/login";
        }

        return thunkAPI.rejectWithValue(message);
    }
});

export const dislikeReview = createAsyncThunk("review/dislike", async (reviewId: string, thunkAPI: any) => {
    try {
        const token: string | null = thunkAPI.getState().auth.user?.token ?? null;
        return await reviewService.dislikeReview(reviewId, (token as string));
    } catch (error: any) {
        const message: string = error.response.data.error;

        if (!checkTokenValidity(error)) {
            thunkAPI.dispatch(logout());
            document.location.href = "/login";
        }

        return thunkAPI.rejectWithValue(message);
    }
});

const reviewSlice = createSlice({
    name: "review",
    initialState,
    reducers: {
        resetReview: (state) => {
            state.successReview = false;
            state.errorReview = false;
            state.messageReview = "";
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createReview.pending, (state) => {
                state.loadingReviewCreation = true;
            })
            .addCase(createReview.fulfilled, (state, action: PayloadAction<IReview>) => {
                state.loadingReviewCreation = false;
                state.successReview = true;
                state.messageReview = "Review Added";
            })
            .addCase(createReview.rejected, (state, action: PayloadAction<any>) => {
                state.loadingReviewCreation = false;
                state.errorReview = true;
                state.messageReview = action.payload;
            })
    }
});

export const { resetReview } = reviewSlice.actions;
export default reviewSlice.reducer;