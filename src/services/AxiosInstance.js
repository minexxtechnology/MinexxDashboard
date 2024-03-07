import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: `https://pthxuif38b.execute-api.us-east-1.amazonaws.com`,
    headers: {
        'Access-Control-Allow-Origin': '*'
    }
});

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem(`_authTkn`)
    const refresh = localStorage.getItem(`_authRfrsh`)
    config.params = config.params || {};
    config.headers['authorization'] = token;
    config.headers['x-refresh'] = refresh;
    return config;
});

export default axiosInstance;
