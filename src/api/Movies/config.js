import { usersStore} from "@/stores/users";
import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://movies_service:81/api/',
});

instance.interceptors.request.use((config) => {

    if (config.headers) {
        const storeUser = usersStore();
        const token = storeUser.getToken;

        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default instance;