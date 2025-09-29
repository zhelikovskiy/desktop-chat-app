import {
	BadRequestException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/modules/users/users.service';
import * as bcrypt from 'bcryptjs';
import { IUser } from 'src/common/interfaces/user.interface';
import { VerificationService } from 'src/modules/verification/verification.service';
import { RegisterDto } from '../../common/dto/auth/register.dto';
import { VerifyEmailDto } from '../../common/dto/auth/verify-email.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
	constructor(
		private readonly configService: ConfigService,
		private userService: UsersService,
		private jwtService: JwtService,
		private verificationService: VerificationService
	) {}

	async isExistingUser(registerDto: RegisterDto) {
		const existingEmail = await this.userService.findOneByEmail(
			registerDto.email
		);
		if (existingEmail)
			throw new BadRequestException(
				'User with this email already exists'
			);

		const existingUsername = await this.userService.findOneByUsername(
			registerDto.username
		);
		if (existingUsername)
			throw new BadRequestException(
				'User with this username already exists'
			);
	}

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
				expiresIn: this.configService.get<string>(
					'REFRESH_TOKEN_EXPIRES_IN',
					{ infer: true }
				),
			}),
		};
	}

	async register(registerDto: RegisterDto) {
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
				expiresIn: this.configService.get<string>(
					'REFRESH_TOKEN_EXPIRES_IN',
					{ infer: true }
				),
			}),
		};
	}

	async sendEmailVerification(registerDto: RegisterDto) {
		await this.verificationService.createVerification({ ...registerDto });
	}

	async confirmEmailByCode(verifyEmailDto: VerifyEmailDto) {
		return await this.verificationService.confirmVerification(
			verifyEmailDto
		);
	}
}
