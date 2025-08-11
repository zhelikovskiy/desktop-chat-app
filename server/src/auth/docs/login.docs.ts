import { applyDecorators } from '@nestjs/common';
import {
	ApiOperation,
	ApiBody,
	ApiOkResponse,
	ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginResponseDto } from '../dto/responses/login.response.dto';
import { LoginRequestDto } from '../dto/requests/login.request.dto';

export function ApiLoginDocs() {
	return applyDecorators(
		ApiOperation({
			summary: 'Login user',
			description: 'Authenticate user and get access/refresh tokens',
		}),
		ApiBody({ type: LoginRequestDto }),
		ApiOkResponse({
			description: 'Login successful',
			type: LoginResponseDto,
		}),
		ApiUnauthorizedResponse({ description: 'Invalid email or password' })
	);
}
