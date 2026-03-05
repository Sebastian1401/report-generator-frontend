import axios from 'axios';

const API_URL = 'http://opi5.local:3001';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

api.interceptors.request.use(request => {
    console.log(`[API Request] ${request.method.toUpperCase()} ${request.url}`, request.data || '');
    return request;
});

api.interceptors.response.use(
    response => response,
    error => {
        console.error('[API Error]', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export default api;