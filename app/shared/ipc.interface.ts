import { loginIpcResponse, logindDto } from './ipc.types';

export interface IpcRenderer {
	login(credentials: logindDto): Promise<loginIpcResponse>;
	logout(): Promise<void>;
	getUserInfo(): Promise<any>;
}

interface IpcResponse<T> {
	success: true;
	data?: T;
}

export class IpcError {
	success: boolean;
	error: string;

	constructor(message: string) {
		this.success = false;
		this.error = message;
	}
}

export type IpcResult<T> = IpcResponse<T> | IpcError;
