import axios from 'axios';

export const BASE_URL = "https://ecommerce-website-pro-backend.onrender.com";
const API_URL = `${BASE_URL}/api`;

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth
export const login = (data: any) => api.post('/auth/login', data);
export const register = (data: any) => api.post('/auth/register', data);

// Products
export const getProducts = () => api.get('/products');
export const getProductById = (id: string) => api.get(`/products/${id}`);
export const deleteProduct = (id: number) => api.delete(`/products/${id}`);

// Categories
export const getCategories = () => api.get('/categories');
export const createCategory = (data: any) => api.post('/categories', data);
export const deleteCategory = (id: number) => api.delete(`/categories/${id}`);

export default api;
