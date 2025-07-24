import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RefreshTokenDto {
	@IsNotEmpty()
	refreshToken: string;
}
