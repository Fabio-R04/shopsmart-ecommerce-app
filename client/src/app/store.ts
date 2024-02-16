import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import authReducer from "../features/auth/authSlice";
import categoryReducer from "../features/category/categorySlice";
import productReducer from "../features/product/productSlice";
import orderReducer from "../features/order/orderSlice";
import reviewReducer from "../features/review/reviewSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        category: categoryReducer,
        product: productReducer,
        order: orderReducer,
        review: reviewReducer
    },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;
