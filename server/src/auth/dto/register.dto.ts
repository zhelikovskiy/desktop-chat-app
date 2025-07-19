import { IsNotEmpty, IsString, IsEmail, MinLength } from 'class-validator';

export class RegisterDto {
	@IsNotEmpty()
	@IsString()
	username: string;

	@IsEmail()
	email: string;

	@IsString()
	@MinLength(6)
	password: string;
}
