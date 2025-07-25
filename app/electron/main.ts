import { app, BrowserWindow } from 'electron';
import registerIpcHandlers from './ipc/handlers';
import createWindow from './configs/window.config';

app.whenReady().then(() => {
	const mainWindow = createWindow();

	const {
		session: { webRequest },
	} = mainWindow.webContents;

	registerIpcHandlers();

	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow();
		}
	});
});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});
