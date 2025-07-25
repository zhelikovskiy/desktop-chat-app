import { defineStore } from 'pinia';

interface UserInfo {
	id: string;
	username: string;
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
		login(userInfo: UserInfo) {
			this.loggedIn = true;
			this.user = userInfo;
		},
		logout() {
			this.loggedIn = false;
			this.user = null;
		},
	},
});
