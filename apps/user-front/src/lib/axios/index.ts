import { AxiosInstance } from "axios";
import { authenticateInstance } from "./instances";

const axiosBaseQuery = (instance: AxiosInstance) =>
    async ({ url, method, data, params, headers, body }: {
        url: string, method: "get" | "post" | "patch" | "delete", data?: any, params?: any,
        headers?: any, body?: any
    }) => {
        try {
            const result = await instance({
                url: url,
                method,
                data: data || body,
                params,
                headers,
            });
            return Promise.resolve(result);
        } catch (axiosError: any) {
            return Promise.reject(axiosError?.response?.data);
        }
    };

export default axiosBaseQuery;