import axios from "axios";
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_ROOT_SERVER, // Base URL for the backend server
    headers: {
        
        "Content-Type": "application/json",
      },
      withCredentials:true
});
export const axiosInstanceForMultipart = axios.create({
  baseURL: import.meta.env.VITE_ROOT_SERVER, // Base URL for the backend server
    withCredentials:true
});

export default axiosInstance
