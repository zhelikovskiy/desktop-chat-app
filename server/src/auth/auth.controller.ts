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
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { ApiLoginDocs } from './docs/login.docs';
import { ApiRegisterDocs } from './docs/register.docs';
import { ApiRefreshDocs } from './docs/refresh.docs';
import { ApiVerifyEmailDocs } from './docs/verify-email.docs';
import { VerifyEmailRequestDto } from './dto/requests/verify-email.request.dto';
import { LoginRequestDto } from './dto/requests/login.request.dto';
import { RefreshTokenRequestDto } from './dto/requests/refresh-token.request.dto';
import { RegisterRequestDto } from './dto/requests/register.request.dto';
import { LoginResponseDto } from './dto/responses/login.response.dto';
import { RefreshTokenResponseDto } from './dto/responses/refresh-token.response.dto';
import { VerifyEmailResponseDto } from './dto/responses/verify-email.response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post('login')
	@ApiLoginDocs()
	async login(@Body() loginDto: LoginRequestDto): Promise<LoginResponseDto> {
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
	@ApiRefreshDocs()
	refresh(
		@Body() refreshTokenDto: RefreshTokenRequestDto
	): Promise<RefreshTokenResponseDto> {
		const { refreshToken } = refreshTokenDto;
		return this.authService.refresh(refreshToken);
	}

	@Post('register')
	@ApiRegisterDocs()
	async register(@Body() registerDto: RegisterRequestDto): Promise<void> {
		await this.authService.requestEmailVerification(registerDto);
	}

	@Post('verify')
	@ApiVerifyEmailDocs()
	async verify(
		@Body() verifyEmailDto: VerifyEmailRequestDto
	): Promise<VerifyEmailResponseDto> {
		const registerData =
			await this.authService.confirmEmailByCode(verifyEmailDto);

		if (!registerData)
			throw new ForbiddenException('Invalid verification code.');

		return this.authService.register(registerData);
	}
}
