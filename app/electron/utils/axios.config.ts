import axios from 'axios';
import store from './store';

const api = axios.create({
	baseURL: 'http://localhost:3000',
	timeout: 5000,
	headers: {
		'Content-Type': 'application/json',
		Accept: 'application/json',
	},
});

api.interceptors.request.use((config) => {
	const token = store.getAccessToken();
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

api.interceptors.response.use(
	(res) => res,
	async (error) => {
		const originalRequest = error.config;
		const isAuthEndpoint =
			originalRequest.url?.includes('/auth/login') ||
			originalRequest.url?.includes('/auth/refresh') ||
			originalRequest.url?.includes('/auth/register');

		if (isAuthEndpoint) {
			return Promise.reject(error);
		}

		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;
			try {
				const refreshToken = store.getRefreshToken();
				const response = await api.post('/auth/refresh', {
					refreshToken: refreshToken,
				});

				if (response.data.accessToken)
					store.setAccessToken(response.data.accessToken);

				return api(originalRequest);
			} catch (error) {
				return Promise.reject(error);
			}
		}
		return Promise.reject(error);
	}
);

export default api;
