import { ipcRenderer, contextBridge } from 'electron';
import { logindDto, loginIpcResponse } from '@shared/ipc.types';

contextBridge.exposeInMainWorld('ipcRenderer', {
	login: (credentials: logindDto): Promise<loginIpcResponse> =>
		ipcRenderer.invoke('auth:login', credentials),
	logout: (): void => ipcRenderer.send('auth:logout'),

	onLogin: (
		callback: (data: {
			email: string;
			username: string;
			id: string;
		}) => void
	) => ipcRenderer.on('auth:loggedIn', (_event, data) => callback(data)),
	onLogout: (callback: () => void) =>
		ipcRenderer.on('auth:loggedOut', () => callback()),
});
