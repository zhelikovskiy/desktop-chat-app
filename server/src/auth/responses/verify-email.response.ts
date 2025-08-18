import { ApiProperty } from '@nestjs/swagger';

export class VerifyEmailResponse {
	@ApiProperty()
	accessToken: string;

	@ApiProperty()
	refreshToken: string;
}
