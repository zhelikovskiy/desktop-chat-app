import {
	Body,
	Controller,
	Get,
	Post,
	UnauthorizedException,
	UseGuards,
	Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post('register')
	async register(@Body() RegisterDto: RegisterDto) {
		return this.authService.register(RegisterDto);
	}

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
}
