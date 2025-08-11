import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { RefreshTokenResponseDto } from '../dto/responses/refresh-token.response.dto';
import { RefreshTokenRequestDto } from '../dto/requests/refresh-token.request.dto';

export function ApiRefreshDocs() {
	return applyDecorators(
		ApiOperation({
			summary: 'Refresh tokens',
			description: 'Get new access and refresh tokens.',
		}),
		ApiBody({ type: RefreshTokenRequestDto }),
		ApiResponse({
			status: 200,
			description: 'New access and refresh token generated',
			type: RefreshTokenResponseDto,
		}),
		ApiResponse({ status: 401, description: 'Invalid refresh token' })
	);
}
