import api from '../configs/axios.config';

const apiService = {
	getUserProfile: async () => {
		try {
			const response = await api.get('/auth/profile');

			return response.data;
		} catch (error: any) {
			throw new Error(
				error.response?.data?.message || 'Failed to fetch user profile.'
			);
		}
	},
};

export default apiService;
