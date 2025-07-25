import { IpcRenderer } from '@shared/ipc.interface';

/* eslint-disable */
declare global {
	interface Window {
		ipcRenderer: IpcRenderer;
	}
}
