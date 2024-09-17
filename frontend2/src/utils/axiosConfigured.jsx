import axios from "axios";
const axiosInstance = axios.create({
    baseURL: 'http://localhost:3124', // Base URL for the backend server
    headers: {
        
        "Content-Type": "application/json",
      },
      withCredentials:true
});
export default axiosInstance