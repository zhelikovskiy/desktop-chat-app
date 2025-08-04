import api from '../configs/axios.config';
import { handleValue } from '../utils/utils';

const registerService = {
	register: async (email: string, username: string, password: string) => {
		try {
			await api.post('/auth/register', {
				email,
				username,
				password,
			});
		} catch (error: any) {
			console.log(error);
			throw new Error(handleValue(error.response.data.message));
		}
	},

	confirmEmailByCode: async (code: string) => {
		try {
			await api.post('/auth/verify', { code });
		} catch (error: any) {
			console.log(error);
			throw new Error(handleValue(error.response.data.message));
		}
	},
};

export default registerService;
