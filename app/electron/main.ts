import { app, BrowserWindow } from 'electron';
import registerIpcHandlers from './ipc/handlers';
import createWindow from './configs/window.config';
import { autoLogin } from './utils/autoLoginOnStart';

app.setAsDefaultProtocolClient('the-hearth');

app.whenReady()
	.then(() => {
		const mainWindow = createWindow();

		registerIpcHandlers();

		app.on('activate', () => {
			if (BrowserWindow.getAllWindows().length === 0) {
				createWindow();
			}
		});

		return mainWindow;
	})
	.then(async (mainWindow) => {
		await autoLogin(mainWindow);
	});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});
