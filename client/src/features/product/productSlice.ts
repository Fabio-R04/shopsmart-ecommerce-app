import { createSlice, createAsyncThunk, PayloadAction, Slice } from "@reduxjs/toolkit";
import productService from "./productService";
import { CartItem, IProduct, ProductState } from "./productInterfaces";
import { ProductData } from "../../pages/AdminDashboard";
import { toast } from "react-hot-toast";
import { checkTokenValidity } from "../../reuseable";
import { logout } from "../auth/authSlice";
import { createOrder } from "../order/orderSlice";
import { IOrder } from "../order/orderInterfaces";
import { ProductFilterData } from "../../pages/Section";
import { AxiosError } from "axios";
import { dislikeReview, likeReview } from "../review/reviewSlice";
import { IReview } from "../review/reviewInterfaces";
import { ReviewFilterData } from "../../pages/Product";

const cart = localStorage.getItem("cart");
const recentlyViewed = localStorage.getItem("recentlyViewed");

const initialState: ProductState = {
    product: null,
    sectionProducts: [],
    searchedProducts: [],
    filterResults: [],
    reviewsFilterResults: [],
    productColors: [],
    bestSelling: [],
    mayLike: [],
    similarProducts: [],
    recentlyViewed: recentlyViewed ? JSON.parse(recentlyViewed) : [],
    cartItems: cart ? JSON.parse(cart) : [],
    loadingProduct: false,
    loadingProductBestSelling: false,
    loadingProductMayLike: false,
    loadingProductDetails: false,
    loadingProductSection: false,
    loadingProductColors: false,
    loadingProductSearch: false,
    loadingProductSimilar: false,
    successProduct: false,
    errorProduct: false,
    messageProduct: ""
}

// GET
export const getBestSelling = createAsyncThunk("product/best-selling", async (_, thunkAPI: any) => {
    try {
        return await productService.getBestSelling();
    } catch (error: any) {
        const message: string = error.response.data.error;
        return thunkAPI.rejectWithValue(message);
    }
});

export const getMayLike = createAsyncThunk("product/may-like", async (_, thunkAPI: any) => {
    try {
        return await productService.getMayLike();
    } catch (error: any) {
        const message: string = error.response.data.error;
        return thunkAPI.rejectWithValue(message);
    }
});

export const getProductDetails = createAsyncThunk("product/details", async (productId: string, thunkAPI: any) => {
    try {
        return await productService.getProductDetails(productId);
    } catch (error: any) {
        const message: string = error.response.data.error;
        return thunkAPI.rejectWithValue(message);
    }
});

export const getSectionProducts = createAsyncThunk("product/section", async (sectionType: string, thunkAPI: any) => {
    try {
        return await productService.getSectionProducts(sectionType);
    } catch (error: any) {
        console.log(error);
        const message: string = error.response.data.error;
        return thunkAPI.rejectWithValue(message);
    }
});

export const getProductColors = createAsyncThunk("product/colors", async (sectionType: string, thunkAPI: any) => {
    try {
        return await productService.getProductColors(sectionType);
    } catch (error: any) {
        const message: string = error.response.data.error;
        return thunkAPI.rejectWithValue(message);
    }
});

export const getSearchedProducts = createAsyncThunk("product/search", async (query: string, thunkAPI: any) => {
    try {
        return await productService.getSearchedProducts(query);
    } catch (error: any) {
        const message: string = error.response.data.error;
        return thunkAPI.rejectWithValue(message);
    }
});

export const getSimilarProducts = createAsyncThunk("product/similar", async (productId: string, thunkAPI: any) => {
    try {
        return await productService.getSimilarProducts(productId);
    } catch (error: any) {
        const message: string = error.response.data.error;
        return thunkAPI.rejectWithValue(message);
    }
});

// POST
export const createProduct = createAsyncThunk("product/create", async (data: ProductData, thunkAPI: any) => {
    try {
        const token: string = thunkAPI.getState().auth.user.token;
        return await productService.createProduct(data, token);
    } catch (error: any) {
        const message: string = error.response.data.error;

        if (!checkTokenValidity(error)) {
            thunkAPI.dispatch(logout());
            document.location.href = "/login";
        }

        return thunkAPI.rejectWithValue(message);
    }
});

const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
        resetProduct: (state) => {
            state.successProduct = false;
            state.errorProduct = false;
            state.messageProduct = "";
        },
        addToCart: (state, action: PayloadAction<CartItem>) => {
            const cart: CartItem[] | null = JSON.parse(localStorage.getItem("cart") as string);
            const cartItem: CartItem = action.payload;

            if (cart) {
                const cartItemExists: CartItem | undefined = cart.find((item) => item._id === action.payload._id);

                if (cartItemExists) {
                    const updatedCartItem: CartItem = {
                        ...cartItemExists,
                        quantity: action.payload.quantity + cartItemExists.quantity
                    }

                    const updatedCart: CartItem[] = state.cartItems.map((item) => {
                        if (item._id === updatedCartItem._id) {
                            return updatedCartItem;
                        } else {
                            return item;
                        }
                    });

                    localStorage.setItem("cart", JSON.stringify(updatedCart));
                    state.cartItems = updatedCart;

                    toast.success("Quantity updated");
                } else {
                    localStorage.setItem("cart", JSON.stringify([
                        ...cart,
                        cartItem
                    ]));
                    state.cartItems.push(cartItem);

                    toast.success("Added to Cart");
                }
            } else {
                localStorage.setItem("cart", JSON.stringify([cartItem]));
                state.cartItems.push(cartItem);

                toast.success("Added to Cart");
            }
        },
        updateQuantity: (state, action: PayloadAction<{
            productId: string;
            productQuantity: number;
        }>) => {
            const { productId, productQuantity } = action.payload;

            const cart: CartItem[] = JSON.parse(localStorage.getItem("cart") as string);
            const updatedCart: CartItem[] = cart.map((item) => {
                if (item._id === productId) {
                    return {
                        ...item,
                        quantity: productQuantity
                    }
                } else {
                    return item;
                }
            });

            localStorage.setItem("cart", JSON.stringify(updatedCart));
            state.cartItems = updatedCart;
        },
        deleteCartItem: (state, action: PayloadAction<{ productId: string; }>) => {
            const { productId } = action.payload;

            const cart: CartItem[] = JSON.parse(localStorage.getItem("cart") as string);
            const updatedCart: CartItem[] = cart.filter((item) => {
                return item._id !== productId;
            });

            localStorage.setItem("cart", JSON.stringify(updatedCart));
            state.cartItems = updatedCart;
        },
        clearProductStorage: (state) => {
            localStorage.removeItem("cart");
            localStorage.removeItem("recentlyViewed");
            state.cartItems = [];
            state.recentlyViewed = [];
        },
        filterProducts: (state, action: PayloadAction<ProductFilterData>) => {
            const { color, price, rating, type } = action.payload;

            switch (type) {
                case "section":
                    state.filterResults = state.sectionProducts.filter((product) => {
                        if (product.productColor === color && product.productPrice <= price && product.rating <= rating) {
                            return product;
                        } else if (color === "all" && product.productPrice <= price && product.rating <= rating) {
                            return product;
                        }
                    });
                    break;
                case "search":
                    state.filterResults = state.searchedProducts.filter((product) => {
                        if (product.productColor === color && product.productPrice <= price && product.rating <= rating) {
                            return product;
                        } else if (color === "all" && product.productPrice <= price && product.rating <= rating) {
                            return product;
                        }
                    });
                    break;
                default:
                    break;
            }
        },
        filterReviews: (state, action: PayloadAction<ReviewFilterData>) => {
            const { ratingFilter } = action.payload;

            switch (ratingFilter) {
                case "all":
                    state.reviewsFilterResults = state.product?.reviews || [];
                    break;
                default:
                    state.reviewsFilterResults = state.reviewsFilterResults.filter((review: IReview) => {
                        return review.rating === Number(ratingFilter);
                    });
                    break;
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createProduct.pending, (state) => {
                state.loadingProduct = true;
            })
            .addCase(createProduct.fulfilled, (state, action: PayloadAction<{ success: string }>) => {
                state.loadingProduct = false;
                state.successProduct = true;
                state.messageProduct = action.payload.success;
            })
            .addCase(createProduct.rejected, (state, action: PayloadAction<any>) => {
                state.loadingProduct = false;
                state.errorProduct = true;
                state.messageProduct = action.payload;
            })
            .addCase(getBestSelling.pending, (state) => {
                state.loadingProductBestSelling = true;
            })
            .addCase(getBestSelling.fulfilled, (state, action: PayloadAction<IProduct[]>) => {
                state.loadingProductBestSelling = false;
                state.bestSelling = action.payload;
            })
            .addCase(getMayLike.pending, (state) => {
                state.loadingProductMayLike = true;
            })
            .addCase(getMayLike.fulfilled, (state, action: PayloadAction<IProduct[]>) => {
                state.loadingProductMayLike = false;
                state.mayLike = action.payload;
            })
            .addCase(getProductDetails.pending, (state) => {
                state.loadingProductDetails = true;
            })
            .addCase(getProductDetails.fulfilled, (state, action: PayloadAction<IProduct>) => {
                state.loadingProductDetails = false;
                state.product = action.payload;
                state.reviewsFilterResults = action.payload.reviews;

                const product: IProduct = action.payload;
                const recentlyViewed: IProduct[] | null = JSON.parse(localStorage.getItem("recentlyViewed") as string);

                if (recentlyViewed) {
                    const productAlreadyExists: IProduct | undefined = recentlyViewed.find((p) => {
                        return p._id === product._id;
                    });

                    if (!productAlreadyExists) {
                        if (recentlyViewed.length === 4) {
                            recentlyViewed.pop();
                        }

                        recentlyViewed.unshift(product);
                        localStorage.setItem("recentlyViewed", JSON.stringify(recentlyViewed));
                        state.recentlyViewed = recentlyViewed;
                    }
                } else {
                    localStorage.setItem("recentlyViewed", JSON.stringify([product]));
                    state.recentlyViewed = [product];
                }
            })
            .addCase(createOrder.fulfilled, (state, action: PayloadAction<IOrder>) => {
                state.cartItems = [];
                localStorage.removeItem("cart");
            })
            .addCase(getSectionProducts.pending, (state) => {
                state.loadingProductSection = true;
            })
            .addCase(getSectionProducts.fulfilled, (state, action: PayloadAction<IProduct[]>) => {
                state.loadingProductSection = false;
                state.sectionProducts = action.payload;
                state.filterResults = action.payload;
            })
            .addCase(getProductColors.pending, (state) => {
                state.loadingProductColors = true;
            })
            .addCase(getProductColors.fulfilled, (state, action: PayloadAction<string[]>) => {
                state.loadingProductColors = false;
                state.productColors = action.payload;
            })
            .addCase(getSearchedProducts.pending, (state) => {
                state.loadingProductSearch = true;
            })
            .addCase(getSearchedProducts.fulfilled, (state, action: PayloadAction<IProduct[]>) => {
                state.loadingProductSearch = false;
                state.searchedProducts = action.payload;
                state.filterResults = action.payload;
            })
            .addCase(getSearchedProducts.rejected, (state, action: PayloadAction<any>) => {
                state.loadingProductSearch = false;
                state.errorProduct = true;
                state.messageProduct = action.payload;
            })
            .addCase(getSimilarProducts.pending, (state) => {
                state.loadingProductSimilar = true;
            })
            .addCase(getSimilarProducts.fulfilled, (state, action: PayloadAction<IProduct[]>) => {
                state.loadingProductSimilar = false;
                state.similarProducts = action.payload;
            })
            .addCase(likeReview.fulfilled, (state, action: PayloadAction<{
                reviewId: string;
                likes: string[];
                dislikes: string[];
            }>) => {
                state.reviewsFilterResults.some((review: IReview): boolean => {
                    if (review._id === action.payload.reviewId) {
                        review.dislikes = action.payload.dislikes;
                        review.likes = action.payload.likes;
                        return true;
                    }
                    return false;
                });
            })
            .addCase(dislikeReview.fulfilled, (state, action: PayloadAction<{
                reviewId: string;
                likes: string[];
                dislikes: string[];
            }>) => {
                state.reviewsFilterResults.some((review: IReview): boolean => {
                    if (review._id === action.payload.reviewId) {
                        review.dislikes = action.payload.dislikes;
                        review.likes = action.payload.likes;
                        return true;
                    }
                    return false;
                });
            })
    }
});

export const {
    resetProduct,
    addToCart,
    updateQuantity,
    deleteCartItem,
    clearProductStorage,
    filterProducts,
    filterReviews
} = productSlice.actions;
export default productSlice.reducer;