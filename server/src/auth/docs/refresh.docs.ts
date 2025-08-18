import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { RefreshTokenResponse } from '../responses/refresh-token.response';
import { RefreshTokenDto } from '../../common/dto/auth/refresh-token.dto';

export function ApiRefreshDocs() {
	return applyDecorators(
		ApiOperation({
			summary: 'Refresh tokens',
			description: 'Get new access and refresh tokens.',
		}),
		ApiBody({ type: RefreshTokenDto }),
		ApiResponse({
			status: 200,
			description: 'New access and refresh token generated',
			type: RefreshTokenResponse,
		}),
		ApiResponse({ status: 401, description: 'Invalid refresh token' })
	);
}
