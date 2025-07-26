import { UserInfo, loginIpcResponse, logindDto } from './ipc.types';

export interface IpcRenderer {
	login(credentials: logindDto): Promise<loginIpcResponse>;
	logout(): Promise<void>;
	getUserInfo(): Promise<any>;
	autoLogin(): Promise<loginIpcResponse>;

	onLoggedIn(callback: (value: UserInfo) => void): void;
	onLoggedOut(callback: () => void): void;
}

export type IpcResult<T> =
	| { success: true; data: T }
	| { success: false; error: string };
