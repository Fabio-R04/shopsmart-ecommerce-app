import { IReview } from "../review/reviewInterfaces";

export interface IProduct {
    _id: string;
    productName: string;
    productDescription: string;
    productPrice: number;
    productStock: number;
    productColor: string;
    productCategory: string;
    rating: number;
    reviews: IReview[];
    createdAt: Date;
}

export interface CartItem {
    _id: string;
    productName: string;
    productDescription: string;
    productPrice: number;
    productStock: number;
    quantity: number;
}

export interface ProductState {
    product: IProduct | null;
    bestSelling: IProduct[];
    mayLike: IProduct[];
    recentlyViewed: IProduct[];
    similarProducts: IProduct[];
    sectionProducts: IProduct[];
    searchedProducts: IProduct[];
    filterResults: IProduct[];
    reviewsFilterResults: IReview[];
    productColors: string[];
    cartItems: CartItem[];
    loadingProduct: boolean;
    loadingProductBestSelling: boolean;
    loadingProductMayLike: boolean;
    loadingProductDetails: boolean;
    loadingProductSection: boolean;
    loadingProductColors: boolean;
    loadingProductSearch: boolean;
    loadingProductSimilar: boolean;
    successProduct: boolean;
    errorProduct: boolean;
    messageProduct: string;
}