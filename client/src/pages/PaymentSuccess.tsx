import React, { useRef, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { handlePaymentSuccess, createOrder, resetOrder } from "../features/order/orderSlice";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import Navbar from "../components/Navbar";
import Spinner from "../components/Spinner";
import { CartItem } from "../features/product/productInterfaces";

export interface OrderData {
    cartItems: CartItem[];
    sessionId: string;
}

function PaymentSuccess() {
    const shouldCheck = useRef<boolean>(true);
    const { sessionId } = useParams();
    const {
        loadingOrderPayment,
        loadingOrderCreate,
        successOrder,
        errorOrder,
        messageOrder
    } = useAppSelector((state) => state.order);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (shouldCheck.current) {
            shouldCheck.current = false;
            dispatch(handlePaymentSuccess(sessionId as string));
        }
    }, []);

    useEffect(() => {
        if (successOrder && messageOrder === "ID Accepted") {
            const cartItems: CartItem[] = JSON.parse(localStorage.getItem("cart") as string);
            if (cartItems) {
                dispatch(createOrder({
                    cartItems,
                    sessionId: sessionId as string
                }));
            }
        }

        if (errorOrder) {
            toast.error(messageOrder);
            navigate("/");
        }

        dispatch(resetOrder());
    }, [successOrder, errorOrder]);

    return (
        <div className="main-container">
            <Navbar />
            <div className="success">
                {(loadingOrderPayment || loadingOrderCreate) ? (
                    <Spinner />
                ) : (
                    <div className="success__content">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fillRule="evenodd" clipRule="evenodd" d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM16.0303 8.96967C16.3232 9.26256 16.3232 9.73744 16.0303 10.0303L11.0303 15.0303C10.7374 15.3232 10.2626 15.3232 9.96967 15.0303L7.96967 13.0303C7.67678 12.7374 7.67678 12.2626 7.96967 11.9697C8.26256 11.6768 8.73744 11.6768 9.03033 11.9697L10.5 13.4393L12.7348 11.2045L14.9697 8.96967C15.2626 8.67678 15.7374 8.67678 16.0303 8.96967Z" fill="#4BB543"></path> </g></svg>
                        <div className="success__content-details">
                            <h1>Payment Success!</h1>
                            <p>Your order has been placed.</p>
                        </div>
                        <Link to="/">Continue Shopping</Link>
                    </div>
                )}
            </div>
        </div>
    )
}

export default PaymentSuccess