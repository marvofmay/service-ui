import { usersStore } from '@/stores/users.js'
import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://users_service/api/',
});

instance.interceptors.request.use((config) => {

    if (config.headers) {
        const store = usersStore();
        const token = store.getToken;

        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default instance;