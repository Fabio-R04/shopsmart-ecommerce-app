import { createSlice, createAsyncThunk, PayloadAction, Slice } from "@reduxjs/toolkit";
import orderService from "./orderService";
import { IOrder, OrderState } from "./orderInterfaces";
import { CartItem } from "../product/productInterfaces";
import { checkTokenValidity, throwError } from "../../reuseable";
import { logout } from "../auth/authSlice";
import { toast } from "react-hot-toast";
import { OrderData } from "../../pages/PaymentSuccess";

const initialState: OrderState = {
    userOrders: [],
    adminOrders: [],
    orderDetails: null,
    loadingOrderCheckout: false,
    loadingOrderAll: false,
    loadingOrderProfile: false,
    loadingOrderPayment: false,
    loadingOrderCreate: false,
    loadingOrderUser: false,
    loadingOrderAdmin: false,
    successOrder: false,
    errorOrder: false,
    messageOrder: ""
}

// GET
export const handlePaymentSuccess = createAsyncThunk("order/payment-success", async (sessionId: string, thunkAPI: any) => {
    try {
        const token: string = thunkAPI.getState().auth.user.token;
        return await orderService.handlePaymentSuccess(sessionId, token);
    } catch (error: any) {
        const message: string = error.response.data.error;

        if (!checkTokenValidity(error)) {
            thunkAPI.dispatch(logout());
            document.location.href = "/login";
        }

        return thunkAPI.rejectWithValue(message);
    }
});

export const getUserOrders = createAsyncThunk("auth/user-orders", async (_, thunkAPI: any) => {
    try {
        const token: string = thunkAPI.getState().auth.user.token;
        return await orderService.getUserOrders(token);
    } catch (error: any) {
        const message: string = error.response.data.error;

        if (!checkTokenValidity(error)) {
            thunkAPI.dispatch(logout());
            document.location.href = "/login";
        }

        return thunkAPI.rejectWithValue(message);
    }
});

export const getAdminOrders = createAsyncThunk("auth/admin-orders", async (_, thunkAPI: any) => {
    try {
        const token: string = thunkAPI.getState().auth.user.token;
        return await orderService.getAdminOrders(token);
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
export const createCheckoutSession = createAsyncThunk("order/checkout", async (products: CartItem[], thunkAPI: any) => {
    try {
        const token: string | null = thunkAPI.getState().auth.user?.token ?? null;

        if (!token) {
            throwError(400, "Please sign in to checkout.");
        }

        return await orderService.createCheckoutSession(products, (token as string));
    } catch (error: any) {
        const message: string = error.response.data.error;

        if (!checkTokenValidity(error)) {
            thunkAPI.dispatch(logout());
            document.location.href = "/login";
        }

        return thunkAPI.rejectWithValue(message);
    }
});

export const createOrder = createAsyncThunk("order/create", async (data: OrderData, thunkAPI: any) => {
    try {
        const token: string = thunkAPI.getState().auth.user.token;
        return await orderService.createOrder(data, token);
    } catch (error: any) {
        const message: string = error.response.data.error;

        if (!checkTokenValidity(error)) {
            thunkAPI.dispatch(logout());
            document.location.href = "/login";
        }

        return thunkAPI.rejectWithValue(message);
    }
});

const orderSlice = createSlice({
    name: "order",
    initialState,
    reducers: {
        resetOrder: (state) => {
            state.successOrder = false;
            state.errorOrder = false;
            state.messageOrder = "";
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createCheckoutSession.pending, (state) => {
                state.loadingOrderCheckout = true;
            })
            .addCase(createCheckoutSession.fulfilled, (state, action: PayloadAction<{
                url: Location;
                sessionId: string;
            }>) => {
                state.loadingOrderCheckout = false;
                window.location = action.payload.url;
            })
            .addCase(createCheckoutSession.rejected, (state, action: PayloadAction<any>) => {
                state.loadingOrderCheckout = false;
                state.errorOrder = true;
                state.messageOrder = action.payload;
                toast.error(action.payload);
            })
            .addCase(handlePaymentSuccess.pending, (state) => {
                state.loadingOrderPayment = true;
            })
            .addCase(handlePaymentSuccess.fulfilled, (state, action: PayloadAction<{ success: string; }>) => {
                state.loadingOrderPayment = false;
                state.successOrder = true;
                state.messageOrder = action.payload.success;
            })
            .addCase(handlePaymentSuccess.rejected, (state, action: PayloadAction<any>) => {
                state.loadingOrderPayment = false;
                state.errorOrder = true;
                state.messageOrder = action.payload;
            })
            .addCase(createOrder.pending, (state) => {
                state.loadingOrderCreate = true;
            })
            .addCase(createOrder.fulfilled, (state, action: PayloadAction<IOrder>) => {
                state.loadingOrderCreate = false;
                toast.success("Order Placed");
                state.orderDetails = action.payload;
            })
            .addCase(createOrder.rejected, (state, action: PayloadAction<any>) => {
                state.loadingOrderCreate = false;
                state.errorOrder = true;
                state.messageOrder = action.payload;
            })
            .addCase(getUserOrders.pending, (state) => {
                state.loadingOrderUser = true;
            })
            .addCase(getUserOrders.fulfilled, (state, action: PayloadAction<IOrder[]>) => {
                state.loadingOrderUser = false;
                state.userOrders = action.payload;
            })
            .addCase(getAdminOrders.pending, (state) => {
                state.loadingOrderAdmin = true;
            })
            .addCase(getAdminOrders.fulfilled, (state, action: PayloadAction<IOrder[]>) => {
                state.loadingOrderAdmin = false;
                state.adminOrders = action.payload;
            })
    }
});

export const { resetOrder } = orderSlice.actions;
export default orderSlice.reducer;