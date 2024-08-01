import axios, { AxiosError } from "axios";
import { authenticateInstance } from "./instances";
import { apiRoutes } from "../apiRoute";

export const getAccessToken = async () => {
    try {
        const config = authenticateInstance.defaults;
        const authAxiosClient = axios.create({
            ...config,
        });
        const response = await authAxiosClient.get(apiRoutes.refreshToken);
        return response;
    } catch (e) {
        if (e instanceof AxiosError) {
            return e.response
        } else {
            return false
        }
    }
};