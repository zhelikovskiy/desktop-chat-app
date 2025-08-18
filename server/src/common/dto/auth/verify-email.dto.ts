import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class VerifyEmailDto {
	@ApiProperty({ example: '123678', minLength: 6 })
	@IsNotEmpty()
	code: string;

	@ApiProperty({ example: 'user@mail.com' })
	@IsEmail()
	email: string;
}
