import axios from "axios";
import { RegisterData } from "../../pages/Register";
import { URL, getConfig } from "../../reuseable";
import { LoginData } from "../../pages/Login";
import { AccountData } from "../../pages/Profile";
import { IUser } from "./authInterfaces";

// GET
const getAdminUsers = async (token: string) => {
    const response = await axios.get(
        `${URL}/auth/admin-users`,
        getConfig(token)
    );

    return response.data;
}

// POST
const register = async (data: RegisterData) => {
    const response = await axios.post(
        `${URL}/auth/register`,
        data,
        undefined
    );

    if (response.data) {
        localStorage.setItem("user", JSON.stringify(response.data));
    }

    return response.data;
}

const login = async (data: LoginData) => {
    const response = await axios.post(
        `${URL}/auth/login`,
        data,
        undefined
    );

    if (response.data) {
        localStorage.setItem("user", JSON.stringify(response.data));
    }

    return response.data;
}

// PUT
const changeAccountDetails = async (data: AccountData, token: string): Promise<IUser> => {
    const response = await axios.put(
        `${URL}/auth/account-details`,
        data,
        getConfig(token)
    );

    return response.data;
}

const authService = {
    register,
    login,
    changeAccountDetails,
    getAdminUsers
}

export default authService;