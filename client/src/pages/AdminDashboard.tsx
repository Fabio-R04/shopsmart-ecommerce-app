import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { createCategory, getCategories, resetCategory } from "../features/category/categorySlice";
import { toast } from "react-hot-toast";
import Navbar from "../components/Navbar";
import Spinner from "../components/Spinner";
import { createProduct, resetProduct } from "../features/product/productSlice";
import { getAdminOrders } from "../features/order/orderSlice";
import { IOrder, ProductOrder } from "../features/order/orderInterfaces";
import moment from "moment";
import { ViewProducts } from "./Profile";
import OrderTable from "../components/OrderTable";
import { getAdminUsers } from "../features/auth/authSlice";
import UserTable from "../components/UserTable";

export interface ProductData {
    productName: string;
    productDescription: string;
    productPrice: number;
    productStock: number;
    productColor: string;
    productImage: File | null;
    productCategory: string;
}

function AdminDashboard() {
    const [viewAllActive, setViewAllActive] = useState<ViewProducts>({
        active: false,
        products: []
    });
    const [productForm, setProductForm] = useState<ProductData>({
        productName: "",
        productDescription: "",
        productPrice: 0,
        productStock: 0,
        productColor: "",
        productImage: null,
        productCategory: "",
    });
    const [categoryName, setCategoryName] = useState<string>("");
    const {
        categories,
        loadingCategory,
        loadingCategoryCategories,
        successCategory,
        errorCategory,
        messageCategory
    } = useAppSelector((state) => state.category);
    const {
        loadingProduct,
        successProduct,
        errorProduct,
        messageProduct
    } = useAppSelector((state) => state.product);
    const {
        adminOrders,
        loadingOrderAdmin
    } = useAppSelector((state) => state.order);
    const {
        adminUsers,
        loadingAuthAdminUsers
    } = useAppSelector((state) => state.auth);

    const dispatch = useAppDispatch();
    const location = useLocation();

    useEffect(() => {
        dispatch(getCategories());
        dispatch(getAdminOrders());
        dispatch(getAdminUsers());
    }, []);

    useEffect(() => {
        if (successProduct) {
            toast.success(messageProduct);
        }

        if (errorProduct) {
            toast.error(messageProduct);
        }

        dispatch(resetProduct());
    }, [successProduct, errorProduct, messageProduct, dispatch]);

    useEffect(() => {
        if (successCategory) {
            toast.success(messageCategory);
        }

        if (errorCategory) {
            toast.error(messageCategory);
        }

        dispatch(resetCategory());
    }, [successCategory, errorCategory, messageCategory, dispatch]);

    const handleProductFormChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;

        setProductForm((prevState) => {
            return {
                ...prevState,
                [name]: value
            }
        });
    }

    const handleProductFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        dispatch(createProduct(productForm));
        setProductForm({
            productName: "",
            productDescription: "",
            productPrice: 0,
            productStock: 0,
            productColor: "",
            productCategory: "",
            productImage: null
        });
    }

    const handleCategoryFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        dispatch(createCategory(categoryName));
        setCategoryName("");
    }

    return (
        <div className="main-container">
            <Navbar />
            <div className="admin">
                <div className="admin__sidebar">
                    <div className="admin__sidebar-container">
                        <Link style={{ marginLeft: "7px" }} to="/admin/dashboard/new-product" className={`admin__sidebar-link ${(location.pathname.includes("admin") && location.pathname.includes("users")) ? "admin__sidebar-link__active" : ""}`}>
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M2 12.124C2 6.53269 6.47713 2 11.9999 2C17.5228 2 21.9999 6.53269 21.9999 12.124L21.9999 17.3675C22.0002 18.1844 22.0004 18.7446 21.8568 19.2364C21.576 20.1982 20.9046 20.9937 20.01 21.4245C19.5525 21.6449 19.0059 21.732 18.2088 21.8591L18.0789 21.8799C17.7954 21.9252 17.5532 21.9639 17.3522 21.9839C17.1431 22.0047 16.9299 22.0111 16.7118 21.9676C15.9942 21.8245 15.4024 21.3126 15.1508 20.6172C15.0744 20.4059 15.0474 20.1916 15.035 19.9793C15.0232 19.7753 15.0232 19.527 15.0232 19.2365L15.0231 15.0641C15.0226 14.6386 15.0222 14.2725 15.1195 13.959C15.3422 13.2416 15.9238 12.6975 16.6477 12.5292C16.9641 12.4556 17.3246 12.4849 17.7435 12.5189L17.8367 12.5264L17.9465 12.5352C18.7302 12.5975 19.2664 12.6402 19.7216 12.8106C20.0415 12.9304 20.3381 13.0953 20.6046 13.2976V12.124C20.6046 7.31288 16.7521 3.41266 11.9999 3.41266C7.24776 3.41266 3.39534 7.31288 3.39534 12.124V13.2976C3.66176 13.0953 3.95843 12.9304 4.27829 12.8106C4.73345 12.6402 5.26965 12.5975 6.05335 12.5352L6.16318 12.5264L6.25641 12.5189C6.67534 12.4849 7.03581 12.4556 7.35224 12.5292C8.07612 12.6975 8.65766 13.2416 8.88039 13.959C8.97774 14.2725 8.9773 14.6386 8.97678 15.0641L8.97671 19.2365C8.97671 19.527 8.97672 19.7753 8.96487 19.9793C8.95254 20.1916 8.9255 20.4059 8.84906 20.6172C8.59754 21.3126 8.00574 21.8245 7.28812 21.9676C7.07001 22.0111 6.85675 22.0047 6.64768 21.9839C6.44671 21.9639 6.20449 21.9252 5.92102 21.8799L5.79106 21.8591C4.99399 21.732 4.44737 21.6449 3.98991 21.4245C3.09534 20.9937 2.42388 20.1982 2.14308 19.2364C2.02467 18.8309 2.00404 18.3788 2.0006 17.7747L2 17.5803V12.124Z" fill="#000000"></path> </g></svg>
                            <p>New Product</p>
                        </Link>
                        <Link style={{ marginLeft: "7px" }} to="/admin/dashboard/new-category" className={`admin__sidebar-link ${(location.pathname.includes("admin") && location.pathname.includes("users")) ? "admin__sidebar-link__active" : ""}`}>
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fillRule="evenodd" clipRule="evenodd" d="M10.5 11.25H16.5V12.75H10.5V11.25Z" fill="#000000"></path> <path fillRule="evenodd" clipRule="evenodd" d="M10.5 7.5H16.5V9H10.5V7.5Z" fill="#000000"></path> <path fillRule="evenodd" clipRule="evenodd" d="M10.5 15H16.5V16.5H10.5V15Z" fill="#000000"></path> <path fillRule="evenodd" clipRule="evenodd" d="M7.5 7.5H9V9H7.5V7.5Z" fill="#000000"></path> <path fillRule="evenodd" clipRule="evenodd" d="M7.5 11.25H9V12.75H7.5V11.25Z" fill="#000000"></path> <path fillRule="evenodd" clipRule="evenodd" d="M7.5 15H9V16.5H7.5V15Z" fill="#000000"></path> <path fillRule="evenodd" clipRule="evenodd" d="M3.75 4.5L4.5 3.75H19.5L20.25 4.5V19.5L19.5 20.25H4.5L3.75 19.5V4.5ZM5.25 5.25V18.75H18.75V5.25H5.25Z" fill="#000000"></path> </g></svg>
                            <p>New Category</p>
                        </Link>
                        <Link style={{ marginLeft: "7px" }} to="/admin/dashboard/users" className={`admin__sidebar-link ${(location.pathname.includes("admin") && location.pathname.includes("users")) ? "admin__sidebar-link__active" : ""}`}>
                            <svg fill="#000000" viewBox="0 -64 640 640" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M96 224c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm448 0c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm32 32h-64c-17.6 0-33.5 7.1-45.1 18.6 40.3 22.1 68.9 62 75.1 109.4h66c17.7 0 32-14.3 32-32v-32c0-35.3-28.7-64-64-64zm-256 0c61.9 0 112-50.1 112-112S381.9 32 320 32 208 82.1 208 144s50.1 112 112 112zm76.8 32h-8.3c-20.8 10-43.9 16-68.5 16s-47.6-6-68.5-16h-8.3C179.6 288 128 339.6 128 403.2V432c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48v-28.8c0-63.6-51.6-115.2-115.2-115.2zm-223.7-13.4C161.5 263.1 145.6 256 128 256H64c-35.3 0-64 28.7-64 64v32c0 17.7 14.3 32 32 32h65.9c6.3-47.4 34.9-87.3 75.2-109.4z"></path></g></svg>
                            <p>Users</p>
                        </Link>
                        <Link style={{ marginLeft: "7px" }} to="/admin/dashboard/orders" className={`admin__sidebar-link ${(location.pathname.includes("admin") && location.pathname.includes("orders")) ? "admin__sidebar-link__active" : ""}`}>
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fillRule="evenodd" clipRule="evenodd" d="M4 5C3.44772 5 3 5.44772 3 6C3 6.55228 3.44772 7 4 7H20C20.5523 7 21 6.55228 21 6C21 5.44772 20.5523 5 20 5H4ZM3 12C3 11.4477 3.44772 11 4 11H20C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13H4C3.44772 13 3 12.5523 3 12ZM3 18C3 17.4477 3.44772 17 4 17H20C20.5523 17 21 17.4477 21 18C21 18.5523 20.5523 19 20 19H4C3.44772 19 3 18.5523 3 18Z" fill="#000000"></path> </g></svg>
                            <p>Orders</p>
                        </Link>
                    </div>
                </div>
                <div className="admin__content">
                    {location.pathname === "/admin/dashboard" && (
                        <div className="admin__content-select">
                            <svg fill="#000000" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M276.941 440.584v565.722c0 422.4 374.174 625.468 674.71 788.668l8.02 4.292 8.131-4.292c300.537-163.2 674.71-366.268 674.71-788.668V440.584l-682.84-321.657L276.94 440.584Zm682.73 1479.529c-9.262 0-18.523-2.372-26.993-6.89l-34.9-18.974C588.095 1726.08 164 1495.906 164 1006.306V404.78c0-21.91 12.65-41.788 32.414-51.162L935.727 5.42c15.134-7.228 32.866-7.228 48 0l739.313 348.2c19.765 9.374 32.414 29.252 32.414 51.162v601.525c0 489.6-424.207 719.774-733.779 887.943l-34.899 18.975c-8.47 4.517-17.731 6.889-27.105 6.889Zm467.158-547.652h-313.412l-91.595-91.482v-83.803H905.041v-116.78h-83.69l-58.503-58.504c-1.92.113-3.84.113-5.76.113-176.075 0-319.285-143.21-319.285-319.285 0-176.075 143.21-319.398 319.285-319.398 176.075 0 319.285 143.323 319.285 319.398 0 1.92 0 3.84-.113 5.647l350.57 350.682v313.412Zm-266.654-112.941h153.713v-153.713L958.462 750.155l3.953-37.27c1.017-123.897-91.595-216.621-205.327-216.621S550.744 588.988 550.744 702.72c0 113.845 92.612 206.344 206.344 206.344l47.21-5.309 63.811 63.7h149.873v116.78h116.781v149.986l25.412 25.299Zm-313.4-553.57c0 46.758-37.949 84.706-84.706 84.706-46.758 0-84.706-37.948-84.706-84.706s37.948-84.706 84.706-84.706c46.757 0 84.706 37.948 84.706 84.706" fillRule="evenodd"></path> </g></svg>
                            <h1>Admin Dashboard</h1>
                            <p>Welcome to the Admin Dashboard, select an option to begin.</p>
                        </div>
                    )}

                    {location.pathname === "/admin/dashboard/new-product" && (
                        (loadingCategoryCategories || loadingProduct) ? (
                            <Spinner />
                        ) : (
                            <div className="admin__content-product shadow">
                                <h1 className="admin__content-product__heading">
                                    New Product
                                </h1>
                                <form onSubmit={handleProductFormSubmit} className="admin__content-product__form">
                                    <div className="admin__content-product__form-field">
                                        <label htmlFor="productName">Product Name</label>
                                        <input
                                            required
                                            onChange={handleProductFormChange}
                                            value={productForm.productName}
                                            name="productName"
                                            type="text"
                                            placeholder="Enter product name"
                                            id="productName"
                                        />
                                    </div>
                                    <div className="admin__content-product__form-field">
                                        <label htmlFor="productDescription">Product Description</label>
                                        <input
                                            required
                                            onChange={handleProductFormChange}
                                            value={productForm.productDescription}
                                            name="productDescription"
                                            type="text"
                                            placeholder="Enter product description"
                                            id="productDescription"
                                        />
                                    </div>
                                    <div className="admin__content-product__form-field">
                                        <label htmlFor="productPrice">Product Price</label>
                                        <input
                                            required
                                            onChange={handleProductFormChange}
                                            value={productForm.productPrice}
                                            name="productPrice"
                                            type="number"
                                            placeholder="Enter product price"
                                            id="productPrice"
                                        />
                                    </div>
                                    <div className="admin__content-product__form-field">
                                        <label htmlFor="productStock">Product Stock</label>
                                        <input
                                            onChange={handleProductFormChange}
                                            value={productForm.productStock}
                                            name="productStock"
                                            type="text"
                                            placeholder="Enter product stock"
                                            id="productStock"
                                        />
                                    </div>
                                    <div className="admin__content-product__form-field">
                                        <label htmlFor="productColor">Product Color</label>
                                        <input
                                            required
                                            onChange={handleProductFormChange}
                                            value={productForm.productColor}
                                            name="productColor"
                                            type="text"
                                            placeholder="Enter product color"
                                            id="productColor"
                                        />
                                    </div>
                                    <div className="admin__content-product__form-field">
                                        <label htmlFor="productCategory">Product Category</label>
                                        <select required onChange={handleProductFormChange} name="productCategory" id="productCategory">
                                            <option selected disabled>Select Category</option>
                                            {categories?.map((c) => (
                                                <option key={c?._id} value={c?.name}>{c?.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="admin__content-product__form-field">
                                        <label htmlFor="productImage">Product Image</label>
                                        <input
                                            required
                                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                if (event.target.files) {
                                                    setProductForm((prevState) => {
                                                        return {
                                                            ...prevState,
                                                            productImage: event.target.files![0]
                                                        }
                                                    })
                                                }
                                            }}
                                            type="file"
                                        />
                                    </div>
                                    <button type="submit" className="admin__content-product__form-btn">
                                        Create Product
                                    </button>
                                </form>
                            </div>
                        )
                    )}
                    {location.pathname === "/admin/dashboard/new-category" && (
                        loadingCategory ? (
                            <Spinner />
                        ) : (
                            <div className="admin__content-product admin__content-category shadow">
                                <h1 className="admin__content-product__heading">
                                    New Category
                                </h1>
                                <form onSubmit={handleCategoryFormSubmit} className="admin__content-product__form">
                                    <div className="admin__content-product__form-field">
                                        <label htmlFor="productName">Category Name</label>
                                        <input
                                            required
                                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setCategoryName(event.target.value)}
                                            value={categoryName}
                                            name="categoryName"
                                            type="text"
                                            placeholder="Enter category name"
                                            id="productName"
                                        />
                                    </div>
                                    <button type="submit" className="admin__content-product__form-btn">
                                        Create Category
                                    </button>
                                </form>
                            </div>
                        )
                    )}
                    {location.pathname === "/admin/dashboard/orders" && (
                        loadingOrderAdmin ? (
                            <Spinner />
                        ) : (
                            <OrderTable
                                orders={adminOrders}
                                viewAllActive={viewAllActive}
                                setViewAllActive={setViewAllActive}
                            />
                        )
                    )}
                    {location.pathname === "/admin/dashboard/users" && (
                        loadingAuthAdminUsers ? (
                            <Spinner />
                        ) : (
                            <UserTable
                                adminUsers={adminUsers}
                            />
                        )
                    )}
                </div>
            </div>
        </div>
    )
}

export default AdminDashboard