import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginRequestDto {
	@ApiProperty({ example: 'user@mail.com', description: 'User email' })
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@ApiProperty({
		example: '12sc#A',
		description: 'User password',
		minLength: 6,
	})
	@IsNotEmpty()
	@MinLength(6)
	password: string;
}
