import ElectronStore from 'electron-store';

interface Tokens {
	accessToken: string | null;
	refreshToken: string | null;
}

const store = new ElectronStore<Tokens>({
	name: 'auth-tokens',
	defaults: {
		accessToken: null,
		refreshToken: null,
	},
});

const tokenStorage = {
	getTokens(): Tokens {
		return {
			accessToken: store.get('accessToken') || null,
			refreshToken: store.get('refreshToken') || null,
		};
	},
	setTokens(accessToken: string, refreshToken: string): void {
		store.set('accessToken', accessToken);
		store.set('refreshToken', refreshToken);
	},
	clearTokens(): void {
		store.delete('accessToken');
		store.delete('refreshToken');
	},
};

export default tokenStorage;
