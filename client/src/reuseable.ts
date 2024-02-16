import { AxiosError } from "axios";
import { toast } from "react-hot-toast";

export const URL: string = `${process.env.REACT_APP_SERVER_URL}`;

export const getConfig = (token: string) => {
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
}

export const checkTokenValidity = (error: AxiosError): boolean => {
    if (error.response?.status === 403) {
        return false;
    }

    return true;
}

export const throwError = (status: number, message: string): never => {
    throw {
        response: {
            data: {
                status,
                error: message
            }
        }
    }
}

export const toTitleCase = (str: string): string => {
    return `${str[0].toUpperCase()}${str.slice(1, str.length).toLowerCase()}`;
}