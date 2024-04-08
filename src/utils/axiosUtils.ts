import axios from 'axios';

const adminAxiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
});

adminAxiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    // eslint-disable-next-line no-param-reassign
    config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  (error) => Promise.reject(error)
);

adminAxiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

export { adminAxiosInstance };
