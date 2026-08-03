import axios from 'axios';

const api = axios.create({
    baseURL:'https://vibetuneback.onrender.com/api',
    withCredentials:true,
});

export default api;