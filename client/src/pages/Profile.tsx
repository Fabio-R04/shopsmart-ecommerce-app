import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { toast } from "react-hot-toast";
import { changeAccountDetails, resetAuth } from "../features/auth/authSlice";
import { getUserOrders } from "../features/order/orderSlice";
import { IOrder, ProductOrder } from "../features/order/orderInterfaces";
import Navbar from "../components/Navbar";
import Spinner from "../components/Spinner";
import moment from "moment";
import { IProduct } from "../features/product/productInterfaces";
import OrderTable from "../components/OrderTable";

export interface AccountData {
    fullName: string;
    email: string;
}

export interface ViewProduct extends IProduct {
    quantity: number;
}

export interface ViewProducts {
    active: boolean;
    products: ViewProduct[];
}

function Profile() {
    const [viewAllActive, setViewAllActive] = useState<ViewProducts>({
        active: false,
        products: []
    });
    const [accountForm, setAccountForm] = useState<AccountData>({
        fullName: "",
        email: ""
    });
    const {
        user,
        successAuth,
        errorAuth,
        messageAuth,
        loadingAccountAuth
    } = useAppSelector((state) => state.auth);
    const {
        userOrders,
        loadingOrderUser
    } = useAppSelector((state) => state.order);

    const dispatch = useAppDispatch();
    const location = useLocation();

    useEffect(() => {
        dispatch(getUserOrders());
    }, []);

    useEffect(() => {
        setAccountForm({
            fullName: user?.fullName!,
            email: user?.email!
        });
    }, [user]);

    useEffect(() => {
        if (successAuth && messageAuth === "Account Details Updated") {
            toast.success(messageAuth);
        }

        if (errorAuth) {
            toast.error(messageAuth);
        }

        dispatch(resetAuth());
    }, [successAuth, errorAuth, messageAuth, dispatch]);

    const handleAccountChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = event.target;

        setAccountForm((prevState: AccountData) => {
            return {
                ...prevState,
                [name]: value
            }
        });
    }

    const handleAccountSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        dispatch(changeAccountDetails(accountForm));
    }

    return (
        <div className="main-container">
            <Navbar />
            <div className="admin profile">
                <div className="admin__sidebar profile__sidebar">
                    <div className="admin__sidebar-container">
                        <Link style={{ marginLeft: "7px" }} to="/profile/account" className={`admin__sidebar-link ${(location.pathname.includes("profile") && location.pathname.includes("account")) ? "admin__sidebar-link__active" : ""}`}>
                            <svg fill="#000000" viewBox="0 -64 640 640" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M96 224c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm448 0c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm32 32h-64c-17.6 0-33.5 7.1-45.1 18.6 40.3 22.1 68.9 62 75.1 109.4h66c17.7 0 32-14.3 32-32v-32c0-35.3-28.7-64-64-64zm-256 0c61.9 0 112-50.1 112-112S381.9 32 320 32 208 82.1 208 144s50.1 112 112 112zm76.8 32h-8.3c-20.8 10-43.9 16-68.5 16s-47.6-6-68.5-16h-8.3C179.6 288 128 339.6 128 403.2V432c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48v-28.8c0-63.6-51.6-115.2-115.2-115.2zm-223.7-13.4C161.5 263.1 145.6 256 128 256H64c-35.3 0-64 28.7-64 64v32c0 17.7 14.3 32 32 32h65.9c6.3-47.4 34.9-87.3 75.2-109.4z"></path></g></svg>
                            <p>Account</p>
                        </Link>
                        <Link style={{ marginLeft: "7px" }} to="/profile/orders" className={`admin__sidebar-link ${(location.pathname.includes("profile") && location.pathname.includes("orders")) ? "admin__sidebar-link__active" : ""}`}>
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fillRule="evenodd" clipRule="evenodd" d="M4 5C3.44772 5 3 5.44772 3 6C3 6.55228 3.44772 7 4 7H20C20.5523 7 21 6.55228 21 6C21 5.44772 20.5523 5 20 5H4ZM3 12C3 11.4477 3.44772 11 4 11H20C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13H4C3.44772 13 3 12.5523 3 12ZM3 18C3 17.4477 3.44772 17 4 17H20C20.5523 17 21 17.4477 21 18C21 18.5523 20.5523 19 20 19H4C3.44772 19 3 18.5523 3 18Z" fill="#000000"></path> </g></svg>
                            <p>Orders</p>
                        </Link>
                    </div>
                </div>
                <div className="admin__content profile__content">
                    {location.pathname === "/profile" && (
                        <div className="admin__content-select">
                            <svg fill="#000000" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M276.941 440.584v565.722c0 422.4 374.174 625.468 674.71 788.668l8.02 4.292 8.131-4.292c300.537-163.2 674.71-366.268 674.71-788.668V440.584l-682.84-321.657L276.94 440.584Zm682.73 1479.529c-9.262 0-18.523-2.372-26.993-6.89l-34.9-18.974C588.095 1726.08 164 1495.906 164 1006.306V404.78c0-21.91 12.65-41.788 32.414-51.162L935.727 5.42c15.134-7.228 32.866-7.228 48 0l739.313 348.2c19.765 9.374 32.414 29.252 32.414 51.162v601.525c0 489.6-424.207 719.774-733.779 887.943l-34.899 18.975c-8.47 4.517-17.731 6.889-27.105 6.889Zm467.158-547.652h-313.412l-91.595-91.482v-83.803H905.041v-116.78h-83.69l-58.503-58.504c-1.92.113-3.84.113-5.76.113-176.075 0-319.285-143.21-319.285-319.285 0-176.075 143.21-319.398 319.285-319.398 176.075 0 319.285 143.323 319.285 319.398 0 1.92 0 3.84-.113 5.647l350.57 350.682v313.412Zm-266.654-112.941h153.713v-153.713L958.462 750.155l3.953-37.27c1.017-123.897-91.595-216.621-205.327-216.621S550.744 588.988 550.744 702.72c0 113.845 92.612 206.344 206.344 206.344l47.21-5.309 63.811 63.7h149.873v116.78h116.781v149.986l25.412 25.299Zm-313.4-553.57c0 46.758-37.949 84.706-84.706 84.706-46.758 0-84.706-37.948-84.706-84.706s37.948-84.706 84.706-84.706c46.757 0 84.706 37.948 84.706 84.706" fillRule="evenodd"></path> </g></svg>
                            <h1>Profile</h1>
                            <p>Welcome to the User Dashboard, select an option to begin.</p>
                        </div>
                    )}
                    {location.pathname === "/profile/account" && (
                        loadingAccountAuth ? (
                            <Spinner />
                        ) : (
                            <div className="admin__content-product admin__content-category admin__content-account shadow">
                                <h1 className="admin__content-product__heading">
                                    Change Account Details
                                </h1>
                                <form onSubmit={handleAccountSubmit} className="admin__content-product__form">
                                    <div className="admin__content-product__form-field">
                                        <label htmlFor="productName">Full Name</label>
                                        <input
                                            required
                                            value={accountForm.fullName}
                                            onChange={handleAccountChange}
                                            name="fullName"
                                            type="text"
                                            placeholder="Enter full name"
                                            id="productName"
                                        />
                                    </div>
                                    <div className="admin__content-product__form-field">
                                        <label htmlFor="productDescription">Email</label>
                                        <input
                                            required
                                            value={accountForm.email}
                                            onChange={handleAccountChange}
                                            name="email"
                                            type="email"
                                            placeholder="Enter email"
                                            id="productDescription"
                                        />
                                    </div>
                                    <button type="submit" className="admin__content-product__form-btn">
                                        Change Account
                                    </button>
                                </form>
                            </div>
                        )
                    )}
                    {location.pathname === "/profile/orders" && (
                        loadingOrderUser ? (
                            <Spinner />
                        ) : (
                            <OrderTable
                                orders={userOrders}
                                viewAllActive={viewAllActive}
                                setViewAllActive={setViewAllActive}
                            />
                        )
                    )}
                </div>
            </div>
        </div>
    )
}

export default Profile;