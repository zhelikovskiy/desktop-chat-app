import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail, MinLength } from 'class-validator';

export class RegisterDto {
	@ApiProperty({ example: 'new_user' })
	@IsNotEmpty()
	@IsString()
	username: string;

	@ApiProperty({ example: 'user@email.com' })
	@IsEmail()
	email: string;

	@ApiProperty({ example: '1s2#X2', minLength: 6 })
	@IsString()
	@MinLength(6)
	password: string;
}
