import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { jwtConstants } from './constants';
import { IUser } from 'src/common/interfaces/user.interface';
import { VerificationService } from 'src/verification/verification.service';
import { RegisterRequestDto } from './dto/requests/register.request.dto';
import { VerifyEmailRequestDto } from './dto/requests/verify-email.request.dto';

@Injectable()
export class AuthService {
	constructor(
		private userService: UsersService,
		private jwtService: JwtService,
		private verificationService: VerificationService
	) {}

	async validateUser(email: string, password: string) {
		const user = await this.userService.findOneByEmail(email);
		if (!user) throw new UnauthorizedException('Invalid email');
		else if (!(await bcrypt.compare(password, user.password)))
			throw new UnauthorizedException('Invalid password');
		else {
			const { password, ...result } = user;
			return result;
		}
	}

	async login(user: IUser) {
		const payload = {
			username: user.username,
			email: user.email,
			sub: user.id,
		};

		return {
			accessToken: this.jwtService.sign(payload),
			refreshToken: this.jwtService.sign(payload, {
				expiresIn: jwtConstants.refreshTokenExpiresIn,
			}),
		};
	}

	async register(registerDto: RegisterRequestDto) {
		const hashedPassword = await bcrypt.hash(registerDto.password, 10);
		const user = await this.userService.createOne({
			...registerDto,
			password: hashedPassword,
		});

		return this.login(user);
	}

	async refresh(token: string) {
		const data = await this.jwtService.verify(token);

		if (!data) throw new UnauthorizedException('Invalid token');

		const user = await this.userService.findOneById(data.sub);

		if (!user) throw new UnauthorizedException('User not found');

		const payload = {
			username: user.username,
			email: user.email,
			sub: user.id,
		};

		return {
			accessToken: this.jwtService.sign(payload),
			refreshToken: this.jwtService.sign(payload, {
				expiresIn: jwtConstants.refreshTokenExpiresIn,
			}),
		};
	}

	async requestEmailVerification(registerDto: RegisterRequestDto) {
		await this.verificationService.createVerification({ ...registerDto });
	}

	async confirmEmailByCode({ code }: VerifyEmailRequestDto) {
		return await this.verificationService.confirmVerification(code);
	}
}
