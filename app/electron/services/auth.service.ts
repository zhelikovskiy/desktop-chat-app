import tokenStorage from '../stores/token.store';
import api from '../configs/axios.config';
import { handleValue } from '../utils/utils';

const authService = {
	login: async (email: string, password: string) => {
		try {
			const response = await api.post('/auth/login', { email, password });

			const { accessToken, refreshToken } = response.data;

			tokenStorage.setTokens(accessToken, refreshToken);
		} catch (error: any) {
			throw new Error(
				handleValue(error.response.data.message) || 'Login failed'
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
			throw new Error(
				handleValue(error.response.data.message) ||
					'Refresh token failed.'
			);
		}
	},

	getAccessToken: () => {
		const tokens = tokenStorage.getTokens();
		return tokens.accessToken;
	},

	checkRefreshToken: () => {
		const tokens = tokenStorage.getTokens();
		return !!tokens.accessToken && !!tokens.refreshToken;
	},
};

export default authService;
