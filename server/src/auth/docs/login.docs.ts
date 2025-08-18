import { applyDecorators } from '@nestjs/common';
import {
	ApiOperation,
	ApiBody,
	ApiOkResponse,
	ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginResponse } from '../responses/login.response';
import { LoginDto } from '../../common/dto/auth/login.dto';

export function ApiLoginDocs() {
	return applyDecorators(
		ApiOperation({
			summary: 'Login user',
			description: 'Authenticate user and get access/refresh tokens',
		}),
		ApiBody({ type: LoginDto }),
		ApiOkResponse({
			description: 'Login successful',
			type: LoginResponse,
		}),
		ApiUnauthorizedResponse({ description: 'Invalid email or password' })
	);
}
