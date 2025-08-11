import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { RegisterRequestDto } from '../dto/requests/register.request.dto';

export function ApiRegisterDocs() {
	return applyDecorators(
		ApiOperation({
			summary: 'Register user (start email verification)',
			description: 'Send user verification email with code',
		}),
		ApiBody({ type: RegisterRequestDto }),
		ApiResponse({ status: 200, description: 'Verification email sent' }),
		ApiResponse({ status: 401, description: 'Invalid credentials' })
	);
}
