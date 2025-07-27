import {
	BadRequestException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { jwtConstants } from './constants';
import { RegisterDto } from './dto/register.dto';
import { IUser } from 'src/common/interfaces/user.interface';
import { isExistingUser } from './utils/is-existing-user';

@Injectable()
export class AuthService {
	constructor(
		private userService: UsersService,
		private jwtService: JwtService
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
				expiresIn: jwtConstants.refreshTokenExpiresIn,
			}),
		};
	}

	async getVerifyLink(registerDto: RegisterDto) {
		await isExistingUser(
			{ email: registerDto.email, username: registerDto.username },
			this.userService
		);

		const payload = {
			email: registerDto.email,
			username: registerDto.username,
			password: registerDto.password,
		};

		const token = this.jwtService.sign(payload, {
			secret: jwtConstants.verifyTokenSecret,
			expiresIn: jwtConstants.verifyTokenExpiresIn,
		});

		return `the-hearth://verify?token=${token}`;
	}

	async verify(token: string) {
		try {
			const data = this.jwtService.verify(token, {
				secret: jwtConstants.verifyTokenSecret,
			}) as RegisterDto;

			await isExistingUser(
				{ email: data.email, username: data.username },
				this.userService
			);

			return data;
		} catch (error) {
			throw new BadRequestException('Invalid or expired token');
		}
	}
}
