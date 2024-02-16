import axios from "axios";
import { URL } from "../../reuseable";
import { ProductData } from "../../pages/AdminDashboard";

// GET
const getBestSelling = async () => {
    const response = await axios.get(`${URL}/product/best-selling`);
    return response.data;
}

const getMayLike = async () => {
    const response = await axios.get(`${URL}/product/may-like`);
    return response.data;
}

const getProductDetails = async (productId: string) => {
    const response = await axios.get(`${URL}/product/details/${productId}`);
    return response.data;
}

const getSectionProducts = async (sectionType: string) => {
    const response = await axios.get(`${URL}/product/section-products/${sectionType}`);
    return response.data;
}

const getProductColors = async (sectionType: string) => {
    const response = await axios.get(`${URL}/product/colors/${sectionType === "" ? "undefined" : sectionType}`);
    return response.data;
}

const getSearchedProducts = async (query: string) => {
    const response = await axios.get(`${URL}/product/search/${query}`);
    return response.data;
}

const getSimilarProducts = async (productId: string) => {
    const response = await axios.get(`${URL}/product/similar/${productId}`);
    return response.data;
}

// POST
const createProduct = async (data: ProductData, token: string) => {
    const {
        productName,
        productDescription,
        productPrice,
        productStock,
        productColor,
        productCategory,
        productImage
    } = data;

    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
        }
    }

    const response = await axios.post(
        `${URL}/product/create`,
        { productName, productDescription, productPrice, 
        productStock, productColor, productCategory, file: productImage },
        config
    );

    return response.data;
}

const productService = {
    createProduct,
    getBestSelling,
    getMayLike,
    getProductDetails,
    getSectionProducts,
    getProductColors,
    getSearchedProducts,
    getSimilarProducts
}

export default productService;