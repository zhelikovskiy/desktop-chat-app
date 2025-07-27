import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpException,
	Logger,
} from '@nestjs/common';

@Catch()
export class GlobalExceptionsFilter implements ExceptionFilter {
	private readonly logger = new Logger(GlobalExceptionsFilter.name);

	catch(exception: any, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse();
		const request = ctx.getRequest();

		const status =
			exception instanceof HttpException ? exception.getStatus() : 500;

		let message: string;

		if (exception instanceof HttpException) {
			const res = exception.getResponse();
			if (typeof res === 'string') {
				message = res;
			} else if (
				typeof res === 'object' &&
				res !== null &&
				'message' in res
			) {
				message = (res as any).message;
			} else {
				message = JSON.stringify(res);
			}
		} else if (exception && exception.message) {
			message = exception.message;
		} else {
			message = 'Internal server error';
		}

		this.logger.error(
			`Status: ${status} Error: ${message} Path: ${request.url}`,
			exception.stack
		);

		response.status(status).json({
			statusCode: status,
			timestamp: new Date().toISOString(),
			path: request.url,
			message,
		});
	}
}

export default GlobalExceptionsFilter;
