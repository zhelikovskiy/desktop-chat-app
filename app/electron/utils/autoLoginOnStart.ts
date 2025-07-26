import { BrowserWindow } from 'electron';
import apiService from '../services/api.service';
import authService from '../services/auth.service';

export const autoLogin = async (win: BrowserWindow) => {
	try {
		const isTokenExist = authService.checkRefreshToken();

		if (!isTokenExist) return;

		await authService.refreshTokens();

		const user = await apiService.getUserProfile();

		win.webContents.send('auth:loggedIn', user);
	} catch (error) {
		console.error('Auto login failed:', error);
	}
};
