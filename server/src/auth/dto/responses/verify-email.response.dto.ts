import { ApiProperty } from '@nestjs/swagger';

export class VerifyEmailResponseDto {
	@ApiProperty()
	accessToken: string;

	@ApiProperty()
	refreshToken: string;
}
