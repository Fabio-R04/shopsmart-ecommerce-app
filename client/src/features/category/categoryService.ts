import axios from "axios";
import { URL, getConfig } from "../../reuseable";

// GET
const getCategories = async (token: string) => {
    const response = await axios.get(
        `${URL}/category/categories`,
        getConfig(token)
    );

    return response.data;
}

// POST
const createCategory = async (categoryName: string, token: string) => {
    const response = await axios.post(
        `${URL}/category/create`,
        { categoryName },
        getConfig(token)
    );

    return response.data;
}

const categoryService = {
    createCategory,
    getCategories
}

export default categoryService;