import {
	ArgumentsHost,
	BadRequestException,
	Catch,
	ExceptionFilter,
	HttpException,
	HttpStatus,
	Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { createResponse } from '../utils/response.utils';
import { ApiError } from '../types/api-error.type';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
	private readonly logger = new Logger(HttpExceptionFilter.name);

	catch(exception: unknown, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();

		const status =
			exception instanceof HttpException
				? exception.getStatus()
				: HttpStatus.INTERNAL_SERVER_ERROR;

		let message: string;
		let errorDetails: string | object | undefined = undefined;

		if (exception instanceof HttpException) {
			const response = exception.getResponse();
			const validationMessages = response['message'];

			if (
				exception instanceof BadRequestException &&
				Array.isArray(validationMessages)
			) {
				const formattedMessages = validationMessages.map(
					(msg: string) => {
						const fieldName = msg.split(' ')[0];
						return (
							`Field '${fieldName}'` +
							msg.substring(fieldName.length)
						);
					}
				);
				message = formattedMessages[0];
			} else {
				message = response['message'] || exception.message;
			}
		} else {
			message = 'Internal server error';

			this.logger.error(
				`HTTP Status: ${status} Error Message: ${message} Path: ${request.url}`,
				exception instanceof Error
					? exception.stack
					: JSON.stringify(exception)
			);
		}

		const apiError: ApiError = {
			code: HttpStatus[status],
			details:
				typeof errorDetails === 'string'
					? errorDetails
					: JSON.stringify(errorDetails),
		};

		response
			.status(status)
			.json(createResponse(false, message, null, apiError));
	}
}
