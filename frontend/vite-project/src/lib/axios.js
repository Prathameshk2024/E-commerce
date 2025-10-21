import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: "/api",
    withCredentials: true, // Important for cookies
});

export default axiosInstance; 