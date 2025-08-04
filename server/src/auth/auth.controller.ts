import {
	Body,
	Controller,
	Get,
	Post,
	UnauthorizedException,
	UseGuards,
	Request,
	ForbiddenException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post('login')
	async login(@Body() loginDto: LoginDto) {
		const user = await this.authService.validateUser(
			loginDto.email,
			loginDto.password
		);
		if (!user) {
			throw new UnauthorizedException();
		}

		return this.authService.login(user);
	}

	@UseGuards(AuthGuard('jwt'))
	@Get('profile')
	getProfile(@Request() req) {
		return req.user;
	}

	@Post('refresh')
	refresh(@Body() refreshTokenDto: RefreshTokenDto) {
		const { refreshToken } = refreshTokenDto;
		return this.authService.refresh(refreshToken);
	}

	@Post('register')
	async register(@Body() registerDto: RegisterDto) {
		await this.authService.requestEmailVerification(registerDto);

		return 200;
	}

	@Post('verify')
	async verify(@Body('code') code: string) {
		const registerData = await this.authService.confirmEmailByCode(code);

		if (!registerData)
			throw new ForbiddenException('Invalid verification code.');

		return this.authService.register(registerData);
	}
}
