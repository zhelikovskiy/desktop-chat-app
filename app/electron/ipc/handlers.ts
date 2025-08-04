import { ipcMain } from 'electron';
import authService from '../services/auth.service';
import apiService from '../services/api.service';
import {
	logindDto,
	loginIpcResponse,
	registerDto,
} from '../../shared/ipc.types';
import { IpcMessages, IpcResult } from '@shared/ipc.interface';
import registerService from '../services/register.service';

const registerIpcHandlers = () => {
	ipcMain.handle(
		IpcMessages.AUTH.LOGIN,
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

	ipcMain.handle(IpcMessages.AUTH.AUTO_LOGIN, async () => {
		const isTokenExist = await authService.checkRefreshToken();

		if (!isTokenExist)
			return { success: false, error: 'No valid session found.' };

		try {
			await authService.refreshTokens();

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
				error: error.message || 'Auto-login failed',
			};
		}
	});

	ipcMain.on(IpcMessages.AUTH.LOGOUT, async (): Promise<IpcResult> => {
		try {
			await authService.logout();

			return {
				success: true,
			};
		} catch (error: any) {
			console.log(error);
			return { success: false, error: error.message || 'Logout failed' };
		}
	});

	ipcMain.handle(
		IpcMessages.REGISTER.REGISTER,
		async (_event, credentials: registerDto): Promise<IpcResult> => {
			try {
				await registerService.register(
					credentials.email,
					credentials.username,
					credentials.password
				);

				return {
					success: true,
				};
			} catch (error: any) {
				console.log(error);
				return {
					success: false,
					error: error.message || 'Register failed. Try again leter',
				};
			}
		}
	);

	ipcMain.handle(
		IpcMessages.REGISTER.VERIFY_CODE,
		async (_event, code: string): Promise<IpcResult> => {
			try {
				await registerService.confirmEmailByCode(code);

				return {
					success: true,
				};
			} catch (error: any) {
				console.log(error);
				return {
					success: false,
					error:
						error.message || 'Code verification error. Try again.',
				};
			}
		}
	);
};

export default registerIpcHandlers;
