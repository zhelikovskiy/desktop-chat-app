import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { RegisterDto } from '../../../common/dto/auth/register.dto';

export function ApiSendVerificationEmailDocs() {
	return applyDecorators(
		ApiOperation({
			summary: 'Send verification email',
			description: 'Send user verification email with code',
		}),
		ApiBody({ type: RegisterDto }),
		ApiResponse({ status: 200, description: 'Verification email sent' }),
		ApiResponse({ status: 401, description: 'Invalid credentials' })
	);
}
