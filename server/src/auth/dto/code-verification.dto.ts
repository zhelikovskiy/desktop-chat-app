import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import { RegisterDto } from './register.dto';

export class CodeVerificationDto {
	@IsNotEmpty()
	@Length(6)
	code: string;

	@IsEmail()
	@IsNotEmpty()
	email: string;
}
