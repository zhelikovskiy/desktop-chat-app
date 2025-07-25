import { IpcResult } from './ipc.interface';

export type loginIpcResponse = IpcResult<{
	email: string;
	username: string;
	id: string;
}>;

export type logindDto = {
	email: string;
	password: string;
};
