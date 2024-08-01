import axios, { AxiosError } from "axios";
import { getAccessToken } from "./getAccessToken";

export const logInRegisterInstance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
})

export const authenticateInstance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true,
})

const handleError = async (error: any) => {
    if (error instanceof AxiosError && error.config) {
        const response = error.response
        const originalRequestConfig: any = error.config;
        if (
            error.config?.url?.includes("login") ||
            error.config.url?.includes("logout") ||
            error.config.url?.includes("profile")
        ) {
            throw error;
        } else if (response && response.status >= 500) {
            window.location.href = "/login";
            return;
        } else if (response?.status === 401 && !originalRequestConfig._retry) {
            originalRequestConfig.retry = true
            const tokenResponse = await getAccessToken();
            if (tokenResponse === false) {
                throw error;
            } else {
                if (tokenResponse) {
                    if (tokenResponse.status === 401) {
                        window.location.href = "/login";
                        return;
                    } else {
                        return axios.request(originalRequestConfig);
                    }
                } else {
                    throw error;
                }
            }
        } else {
            throw error;
        }
    }
    throw error
}

authenticateInstance.interceptors.response.use(async (response) => {
    return response
}, handleError)