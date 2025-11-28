import { app, BrowserWindow } from 'electron';
import registerIpcHandlers from './ipc/handlers';
import createWindow from './utils/windowManager';

app.whenReady().then(() => {
	createWindow();

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
