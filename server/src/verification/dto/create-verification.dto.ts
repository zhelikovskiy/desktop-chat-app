import { IsNotEmpty, IsString, IsEmail, MinLength } from 'class-validator';

export class CreateVerificationDto {
	@IsNotEmpty()
	@IsString()
	username: string;

	@IsEmail()
	email: string;

	@IsString()
	@MinLength(6)
	password: string;
}
