/// <reference types="vite-plugin-electron/electron-env" />

declare namespace NodeJS {
	interface ProcessEnv {
		APP_ROOT: string;
		VITE_PUBLIC: string;
		API_URL: string;
	}
}

interface IpcRendererApi {
	on: typeof import('electron').ipcRenderer.on;
	off: typeof import('electron').ipcRenderer.off;
	send: typeof import('electron').ipcRenderer.send;
	invoke: typeof import('electron').ipcRenderer.invoke;
	login(
		email: string,
		password: string
	): Promise<{ success: boolean; message: string }>;
}

interface Window {
	ipcRenderer: IpcRendererApi;
}
