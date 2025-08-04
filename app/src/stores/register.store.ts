import { defineStore } from 'pinia';

export const useRegisterStore = defineStore('register', {
	state: (): { email: string } => ({
		email: '',
	}),
	actions: {
		register(email: string, username: string, password: string) {
			this.email = email;

			return window.ipcRenderer.register({
				email,
				username,
				password,
			});
		},

		verifyCode(code: string) {
			return window.ipcRenderer.verifyEmailByCode(code);
		},
	},
});
