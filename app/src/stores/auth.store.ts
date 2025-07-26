import { logindDto, UserInfo } from '@shared/ipc.types';
import { defineStore } from 'pinia';

interface AuthState {
	loggedIn: boolean;
	user: UserInfo | null;
}

export const useAuthStore = defineStore('auth', {
	state: (): AuthState => ({
		loggedIn: false,
		user: null,
	}),
	getters: {
		isAuthenticated: (state) => state.loggedIn,
		getUserInfo: (state) => state.user,
	},
	actions: {
		async login(credentials: logindDto) {
			const response = await window.ipcRenderer.login(credentials);

			if (response.success) {
				this.loggedIn = true;
				this.user = response.data;
			} else {
				throw new Error(response.error || 'Login failed');
			}
		},

		logout() {
			this.loggedIn = false;
			this.user = null;
		},

		async autoLogin() {
			const response = await window.ipcRenderer.autoLogin();

			if (response.success) {
				this.loggedIn = true;
				this.user = response.data;
			} else {
				this.loggedIn = false;
				this.user = null;
			}
		},
	},
});
