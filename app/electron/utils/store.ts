import ElectronStore from 'electron-store';

const store = new ElectronStore();

export const setTokens = (accessToken: string, refreshToken: string) => {
	store.set('ACCESS_TOKEN', accessToken);
	store.set('REFRESH_TOKEN', refreshToken);
};
export const setAccessToken = (token: string) => {
	store.set(`ACCESS_TOKEN`, token);
};
export const setRefreshToken = (token: string) => {
	store.set(`REFRESH_TOKEN`, token);
};

export const getAccessToken = () => {
	return store.get('ACCESS_TOKEN');
};
export const getRefreshToken = () => {
	return store.get('REFRESH_TOKEN');
};

export const clearTokens = () => {
	store.delete('REFRESH_TOKEN');
	store.delete('ACCESS_TOKEN');
};
