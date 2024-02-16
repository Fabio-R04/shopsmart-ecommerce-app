import axios from "axios";
import { URL, getConfig } from "../../reuseable";
import { CartItem } from "../product/productInterfaces";
import { OrderData } from "../../pages/PaymentSuccess";
import { IOrder } from "./orderInterfaces";

// GET
const handlePaymentSuccess = async (sessionId: string, token: string) => {
    const response = await axios.get(
        `${URL}/order/check-payment/${sessionId}`,
        getConfig(token)
    );

    return response.data;
}

const getUserOrders = async (token: string) => {
    const response = await axios.get(
        `${URL}/order/user-orders`,
        getConfig(token)
    );

    return response.data;
}

const getAdminOrders = async (token: string) => {
    const response = await axios.get(
        `${URL}/order/admin-orders`,
        getConfig(token)
    );

    return response.data;
}

// POST
const createCheckoutSession = async (products: CartItem[], token: string) => {
    const response = await axios.post(
        `${URL}/order/create-session`,
        products,
        getConfig(token)
    );

    return response.data;
}

const createOrder = async (data: OrderData, token: string) => {
    const response = await axios.post(
        `${URL}/order/create/${data.sessionId}`,
        data.cartItems,
        getConfig(token)
    );

    return response.data;
}

const orderService = {
    createCheckoutSession,
    handlePaymentSuccess,
    createOrder,
    getUserOrders,
    getAdminOrders
}

export default orderService;