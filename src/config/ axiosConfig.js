import axios from "axios";
import { loadAwsWafScript, awsWafToken } from "../utils/wafUtils";

const axiosInstance = axios.create({
    baseURL: "https://api.prod.jcloudify.com/",
});

axiosInstance.interceptors.request.use(async (config) => {
    await loadAwsWafScript();
    config.headers["x-aws-waf-token"] = await awsWafToken();
    return config;
});

export default axiosInstance;
