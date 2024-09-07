import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { BACKEND_URL } from "../../redux/store";

const axiosInstance = axios.create({
  baseURL: BACKEND_URL,
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig<any>) => {
    try {
      const token = JSON.parse(sessionStorage.getItem("token") as string);
      if (token && config.headers) {
        config.headers.Authorization = token ? `Bearer ${token}` : "";
      }
    } catch (error) {
      console.error("Error retrieving token from localStorage", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse<any, any>) => {
    const method = response?.config?.method?.toUpperCase(); // Get HTTP method
    if (
      method === "POST" ||
      method === "DELETE" ||
      method === "PUT" ||
      method === "PATCH"
    ) {
      //   toast.success(response?.data?.message, { autoClose: 1000 });
    }

    return response;
  },
  (error) => {
    console.log(error);
    // toast.error(error?.response?.data?.message, { autoClose: 3000 });
    return Promise.reject(error);
  }
);

export default axiosInstance;
