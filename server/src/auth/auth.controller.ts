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
import { MailService } from 'src/mail/mail.service';

@Controller('auth')
export class AuthController {
	constructor(
		private authService: AuthService,
		private mailService: MailService
	) {}

	@Post('register')
	async register(@Body() registerDto: RegisterDto) {
		const link = await this.authService.getVerifyLink(registerDto);

		await this.mailService.sendVerificationEmail(
			registerDto.email,
			registerDto.username,
			link
		);

		return 200;
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

	@Post('verify')
	async verify(@Body('token') token: string) {
		const payload = await this.authService.verify(token);

		const registerDto: RegisterDto = {
			email: payload.email,
			username: payload.username,
			password: payload.password,
		};

		return this.authService.register(registerDto);
	}
}
