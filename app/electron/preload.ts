import { ipcRenderer, contextBridge } from 'electron';
import { logindDto, loginIpcResponse, UserInfo } from '@shared/ipc.types';

contextBridge.exposeInMainWorld('ipcRenderer', {
	login: (credentials: logindDto): Promise<loginIpcResponse> =>
		ipcRenderer.invoke('auth:login', credentials),
	logout: (): void => ipcRenderer.send('auth:logout'),
	autoLogin: (): Promise<loginIpcResponse> =>
		ipcRenderer.invoke('auth:autoLogin'),

	onLoggedIn: (callback: (value: UserInfo) => void) =>
		ipcRenderer.on('auth:loggedIn', (_event, value) => callback(value)),
	onLoggedOut: (callback: () => void) =>
		ipcRenderer.on('auth:loggedOut', () => callback()),
});
