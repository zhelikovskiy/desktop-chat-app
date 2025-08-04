import {
	UserInfo,
	loginIpcResponse,
	logindDto,
	registerDto,
} from './ipc.types';

export interface IpcRenderer {
	login(credentials: logindDto): Promise<loginIpcResponse>;
	logout(): Promise<void>;
	getUserInfo(): Promise<any>;
	autoLogin(): Promise<loginIpcResponse>;

	register(credentials: registerDto): Promise<IpcResult>;
	verifyEmailByCode(code: string): Promise<IpcResult>;

	onLoggedIn(callback: (value: UserInfo) => void): void;
	onLoggedOut(callback: () => void): void;
}

export type IpcResult<T = unknown> =
	| { success: true; data?: T }
	| { success: false; error: string };

export const IpcMessages = {
	AUTH: {
		LOGIN: 'auth:login',
		LOGOUT: 'auth:logout',
		AUTO_LOGIN: 'auth:auto_login',
	},
	REGISTER: {
		REGISTER: 'register:sign_up',
		SEND_VERIFY_EMAIL: 'register:send_verify_email',
		VERIFY_CODE: 'register:verify_code',
	},
};
