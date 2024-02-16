import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import categoryService from "./categoryService";
import { CategoryState, ICategory } from "./categoryInterfaces";
import { checkTokenValidity } from "../../reuseable";
import { logout } from "../auth/authSlice";

const initialState: CategoryState = {
    categories: [],
    loadingCategory: false,
    loadingCategoryCategories: false,
    successCategory: false,
    errorCategory: false,
    messageCategory: ""
}

// GET
export const getCategories = createAsyncThunk("category/categories", async (_, thunkAPI: any) => {
    try {
        const token: string = thunkAPI.getState().auth.user.token;
        return await categoryService.getCategories(token);
    } catch (error: any) {
        const message: string = error.response.data.error;

        if (!checkTokenValidity(error)) {
            thunkAPI.dispatch(logout());
            document.location.href = "/login";
        }

        return thunkAPI.rejectWithValue(message);
    }
});

// POST
export const createCategory = createAsyncThunk("category/create", async (categoryName: string, thunkAPI: any) => {
    try {
        const token: string = thunkAPI.getState().auth.user.token;
        return await categoryService.createCategory(categoryName, token);
    } catch (error: any) {
        const message: string = error.response.data.error;

        if (!checkTokenValidity(error)) {
            thunkAPI.dispatch(logout());
            document.location.href = "/login";
        }

        return thunkAPI.rejectWithValue(message); 
    }
});

const categorySlice = createSlice({
    name: "category",
    initialState,
    reducers: {
        resetCategory: (state) => {
            state.successCategory = false;
            state.errorCategory = false;
            state.messageCategory = "";
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createCategory.pending, (state) => {
                state.loadingCategory = true;
            })
            .addCase(createCategory.fulfilled, (state, action: PayloadAction<ICategory>) => {
                state.loadingCategory = false;
                state.successCategory = true;
                state.messageCategory = "Category Created";
                state.categories.push(action.payload);
            })
            .addCase(createCategory.rejected, (state, action: PayloadAction<any>) => {
                state.loadingCategory = false;
                state.errorCategory = true;
                state.messageCategory = action.payload;
            })
            .addCase(getCategories.pending, (state) => {
                state.loadingCategoryCategories = true;
            })
            .addCase(getCategories.fulfilled, (state, action: PayloadAction<ICategory[]>) => {
                state.loadingCategoryCategories = false;
                state.categories = action.payload;
            })
    }
});

export const { resetCategory } = categorySlice.actions;
export default categorySlice.reducer;