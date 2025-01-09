import axios from "axios";
import { loadAwsWafScript, awsWafToken } from "../utils/wafUtils";

export const setupAxiosInterceptors = async () => {
    const axiosInstance = axios.create({
        baseURL: "https://api.prod.jcloudify.com/",
    });

    await loadAwsWafScript();

    axiosInstance.interceptors.request.use(
        async (config) => {
            const token = await awsWafToken();
            config.headers["x-aws-waf-token"] = token;
            return config;
        },
        (error) => Promise.reject(error)
    );

    return axiosInstance;
};
