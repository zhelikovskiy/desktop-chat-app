import {
	Body,
	Controller,
	Get,
	Post,
	UnauthorizedException,
	UseGuards,
	ForbiddenException,
	Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { ApiLoginDocs } from './docs/login.docs';
import { ApiSendVerificationEmailDocs } from './docs/send-verification-email.docs';
import { ApiRefreshDocs } from './docs/refresh.docs';
import { ApiVerifyEmailDocs } from './docs/verify-email.docs';
import { VerifyEmailDto } from '../../common/dto/auth/verify-email.dto';
import { LoginDto } from '../../common/dto/auth/login.dto';
import { RefreshTokenDto } from '../../common/dto/auth/refresh-token.dto';
import { RegisterDto } from '../../common/dto/auth/register.dto';
import { LoginResponse } from './responses/login.response';
import { RefreshTokenResponse } from './responses/refresh-token.response';
import { VerifyEmailResponse } from './responses/verify-email.response';
import { Request } from 'express';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post('login')
	@ApiLoginDocs()
	async login(@Body() loginDto: LoginDto): Promise<LoginResponse> {
		const user = await this.authService.validateUser(
			loginDto.email,
			loginDto.password
		);
		if (!user) {
			throw new UnauthorizedException();
		}

		return this.authService.login(user);
	}

	@Post('refresh')
	@ApiRefreshDocs()
	refresh(
		@Body() refreshTokenDto: RefreshTokenDto
	): Promise<RefreshTokenResponse> {
		const { refreshToken } = refreshTokenDto;
		return this.authService.refresh(refreshToken);
	}

	@Post('send-verification-email')
	@ApiSendVerificationEmailDocs()
	async sendVerificationEmail(
		@Body() registerDto: RegisterDto
	): Promise<void> {
		await this.authService.isExistingUser(registerDto);
		await this.authService.sendEmailVerification(registerDto);
	}

	@Post('verify-email')
	@ApiVerifyEmailDocs()
	async verifyEmail(
		@Body() verifyEmailDto: VerifyEmailDto
	): Promise<VerifyEmailResponse> {
		const registerData =
			await this.authService.confirmEmailByCode(verifyEmailDto);

		if (!registerData)
			throw new ForbiddenException('Invalid verification code.');

		return this.authService.register(registerData);
	}

	@Get('me')
	@UseGuards(AuthGuard('jwt'))
	getProfile(@Req() req: Request) {
		return req.user;
	}

	@Post('create')
	@UseGuards(AuthGuard('jwt'))
	async createUser(
		@Body()
		dto: {
			username: string;
			email: string;
			password: string;
		},
		@Req() req: Request
	) {
		return this.authService.register(dto);
	}
}
