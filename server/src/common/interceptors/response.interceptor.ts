import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor,
} from '@nestjs/common';
import { ApiResponse } from '../types/api-respone.type';
import { Observable, map } from 'rxjs';
import { createResponse } from '../utils/response.utils';

@Injectable()
export class ResponseInterceptor<T>
	implements NestInterceptor<T, ApiResponse<T>>
{
	intercept(
		context: ExecutionContext,
		next: CallHandler<T>
	): Observable<ApiResponse<T>> {
		return next.handle().pipe(map((data) => this.wrapResponse(data)));
	}

	private wrapResponse<T>(data: T): ApiResponse<T> {
		if (typeof data === 'object' && data !== null) {
			const responseData = 'data' in data ? (data as any).data : data;
			const message = 'message' in data ? (data as any).message : 'OK';

			return createResponse(true, message, responseData ?? null);
		}

		return createResponse(true, 'OK', data ?? null);
	}
}
