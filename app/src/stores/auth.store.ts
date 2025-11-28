import { defineStore } from 'pinia';

interface UserInfo {
	id: string;
	name: string;
	email: string;
}
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
		login() {
			this.loggedIn = true;
		},
		logout() {
			this.loggedIn = false;
			this.user = null;
		},
	},
});
