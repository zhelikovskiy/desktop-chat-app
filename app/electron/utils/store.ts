import ElectronStore from 'electron-store';

const store = new ElectronStore();

const setTokens = (accessToken: string, refreshToken: string) => {
	store.set('ACCESS_TOKEN', accessToken);
	store.set('REFRESH_TOKEN', refreshToken);
};
const setAccessToken = (token: string) => {
	store.set(`ACCESS_TOKEN`, token);
};
const setRefreshToken = (token: string) => {
	store.set(`REFRESH_TOKEN`, token);
};

const getAccessToken = () => {
	return store.get('ACCESS_TOKEN');
};
const getRefreshToken = () => {
	return store.get('REFRESH_TOKEN');
};

const clearTokens = () => {
	store.delete('REFRESH_TOKEN');
	store.delete('ACCESS_TOKEN');
};

export default {
	setTokens,
	setAccessToken,
	setRefreshToken,
	getAccessToken,
	getRefreshToken,
	clearTokens,
};
