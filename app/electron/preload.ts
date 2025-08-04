import { ipcRenderer, contextBridge } from 'electron';
import {
	logindDto,
	loginIpcResponse,
	registerDto,
	UserInfo,
} from '../shared/ipc.types';
import { IpcMessages, IpcResult } from '../shared/ipc.interface';

contextBridge.exposeInMainWorld('ipcRenderer', {
	login: (credentials: logindDto): Promise<loginIpcResponse> =>
		ipcRenderer.invoke(IpcMessages.AUTH.LOGIN, credentials),
	logout: (): void => ipcRenderer.send(IpcMessages.AUTH.LOGOUT),
	autoLogin: (): Promise<loginIpcResponse> =>
		ipcRenderer.invoke(IpcMessages.AUTH.AUTO_LOGIN),

	register: (credetials: registerDto): Promise<IpcResult> =>
		ipcRenderer.invoke(IpcMessages.REGISTER.REGISTER, credetials),
	verifyEmailByCode: (code: string): Promise<IpcResult> =>
		ipcRenderer.invoke(IpcMessages.REGISTER.VERIFY_CODE, code),

	onLoggedIn: (callback: (value: UserInfo) => void) =>
		ipcRenderer.on('auth:loggedIn', (_event, value) => callback(value)),
	onLoggedOut: (callback: () => void) =>
		ipcRenderer.on('auth:loggedOut', () => callback()),
});
