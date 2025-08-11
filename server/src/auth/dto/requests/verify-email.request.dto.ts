import { ApiProperty } from '@nestjs/swagger';

export class VerifyEmailRequestDto {
	@ApiProperty({ example: '123678', minLength: 6 })
	code: string;
}
