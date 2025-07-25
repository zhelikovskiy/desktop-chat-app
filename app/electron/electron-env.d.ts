/// <reference types="vite-plugin-electron/electron-env" />

import { IpcRenderer } from '@shared/ipc.interface';

declare namespace NodeJS {
	interface ProcessEnv {
		APP_ROOT: string;
		VITE_PUBLIC: string;
		API_URL: string;
	}
}

interface Window {
	ipcRenderer: IpcRenderer;
}
