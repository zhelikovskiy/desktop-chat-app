import { ipcMain } from 'electron';
import authService from '../services/auth.service';
import apiService from '../services/api.service';
import { logindDto, loginIpcResponse } from '@shared/ipc.types';

const registerIpcHandlers = () => {
	ipcMain.handle(
		'auth:login',
		async (_event, credentials: logindDto): Promise<loginIpcResponse> => {
			try {
				await authService.login(
					credentials.email,
					credentials.password
				);

				const user = await apiService.getUserProfile();

				return {
					success: true,
					data: {
						email: user.email,
						username: user.username,
						id: user.id,
					},
				};
			} catch (error: any) {
				return {
					success: false,
					error: error.message || 'Login failed. Please try again.',
				};
			}
		}
	);

	ipcMain.on('auth:logout', async () => {
		authService.logout();
	});
};

export default registerIpcHandlers;
