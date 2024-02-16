import { IUser } from "../auth/authInterfaces";
import { IProduct } from "../product/productInterfaces";

export enum OrderStatus {
    PAID = "paid",
    SHIPPED = "shipped",
    ARRIVED = "arrived"
}

export interface ProductOrder {
    details: IProduct;
    quantity: number;
}

export interface IOrder {
    _id: string;
    user: IUser;
    status: OrderStatus;
    sessionId: string;
    products: ProductOrder[];
    createdAt: Date;
}

export interface OrderState {
    userOrders: IOrder[];
    adminOrders: IOrder[];
    orderDetails: IOrder | null;
    loadingOrderCheckout: boolean;
    loadingOrderAll: boolean;
    loadingOrderProfile: boolean;
    loadingOrderPayment: boolean;
    loadingOrderCreate: boolean;
    loadingOrderUser: boolean;
    loadingOrderAdmin: boolean;
    successOrder: boolean;
    errorOrder: boolean;
    messageOrder: string;
}