import { ApiError } from '../types/api-error.type';
import { ApiResponse } from '../types/api-respone.type';

export function createResponse<T>(
	success: boolean,
	message: string,
	data: T | null = null,
	error: ApiError | null = null
): ApiResponse<T> {
	return {
		success,
		message,
		data,
		error,
	};
}
