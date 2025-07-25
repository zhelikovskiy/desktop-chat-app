import axios from 'axios';
import authService from '../services/auth.service';

const api = axios.create({
	baseURL: 'http://localhost:3000',
	timeout: 5000,
	headers: {
		'Content-Type': 'application/json',
		Accept: 'application/json',
	},
});

api.interceptors.request.use(
	(config) => {
		const accessToken = authService.getAccessToken();
		if (accessToken) {
			config.headers.Authorization = `Bearer ${accessToken}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

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
				await authService.refreshTokens();

				return api(originalRequest);
			} catch (error) {
				return Promise.reject(error);
			}
		}

		return Promise.reject(error);
	}
);

export default api;
