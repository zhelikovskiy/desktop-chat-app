import { ipcMain } from 'electron';
import api from '../utils/axios.config';
import store from '../utils/store';

const registerIpcHandlers = () => {
	ipcMain.handle(
		'auth:login',
		async (event, data: { email: string; password: string }) => {
			try {
				const response = await api.post('/auth/login', data);

				const { accessToken, refreshToken } = response.data;

				store.setTokens(accessToken, refreshToken);

				return { success: true, message: null };
			} catch (error: any) {
				return {
					success: false,
					message:
						error.response?.data?.message ||
						'Server error occurred during login.',
				};
			}
		}
	);
	ipcMain.on('auth:logout', async (event, data) => {
		store.clearTokens();
	});
};

export default registerIpcHandlers;
