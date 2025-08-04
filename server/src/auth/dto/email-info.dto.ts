import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class EmailInfoDto {
	@IsNotEmpty()
	@IsString()
	username: string;

	@IsEmail()
	email: string;
}
