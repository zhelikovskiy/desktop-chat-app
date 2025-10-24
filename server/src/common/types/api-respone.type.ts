import { ApiError } from './api-error.type';

export interface ApiResponse<T = any> {
	success: boolean;
	message: string;
	data: T | null;
	error: ApiError | null;
}
