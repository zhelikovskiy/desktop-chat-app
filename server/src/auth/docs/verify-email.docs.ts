import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { VerifyEmailRequestDto } from '../dto/requests/verify-email.request.dto';
import { VerifyEmailResponseDto } from '../dto/responses/verify-email.response.dto';

export function ApiVerifyEmailDocs() {
	return applyDecorators(
		ApiOperation({
			summary: 'Verify email',
			description: 'Verify email by code and get access/refresh tokens',
		}),
		ApiBody({ type: VerifyEmailRequestDto }),
		ApiResponse({
			status: 200,
			description: 'Account created',
			type: VerifyEmailResponseDto,
		}),
		ApiResponse({ status: 401, description: 'Invalid credentials' })
	);
}
