import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { VerifyEmailDto } from '../../../common/dto/auth/verify-email.dto';
import { VerifyEmailResponse } from '../responses/verify-email.response';

export function ApiVerifyEmailDocs() {
	return applyDecorators(
		ApiOperation({
			summary: 'Verify email',
			description: 'Verify email by code and get access/refresh tokens',
		}),
		ApiBody({ type: VerifyEmailDto }),
		ApiResponse({
			status: 200,
			description: 'Account created',
			type: VerifyEmailResponse,
		}),
		ApiResponse({ status: 401, description: 'Invalid credentials' })
	);
}
