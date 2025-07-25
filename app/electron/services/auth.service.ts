import tokenStorage from '../stores/token.store';
import api from '../configs/axios.config';

const authService = {
	login: async (email: string, password: string) => {
		try {
			const response = await api.post('/auth/login', { email, password });

			const { accessToken, refreshToken } = response.data;

			tokenStorage.setTokens(accessToken, refreshToken);
		} catch (error: any) {
			const { message } = error.response.data;
			throw new Error(
				Array.isArray(message) ? message[0] : message || 'Login failed'
			);
		}
	},

	logout: () => {
		tokenStorage.clearTokens();
	},

	refreshTokens: async () => {
		try {
			const tokens = tokenStorage.getTokens();

			if (!tokens.refreshToken)
				throw new Error('No refresh token available');

			const response = await api.post('/auth/refresh', {
				refreshToken: tokens.refreshToken,
			});
			const { accessToken, refreshToken } = response.data;

			tokenStorage.setTokens(accessToken, refreshToken);
		} catch (error: any) {
			return Promise.reject(error.data.error || error.message);
		}
	},

	getAccessToken: () => {
		const tokens = tokenStorage.getTokens();
		return tokens.accessToken;
	},
};

export default authService;
