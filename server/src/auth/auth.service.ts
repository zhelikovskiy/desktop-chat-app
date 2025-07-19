import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { jwtConstants } from './constants';
import { RegisterDto } from './dto/register.dto';
import { IUser } from 'src/common/interfaces/user.interface';

@Injectable()
export class AuthService {
	constructor(
		private userService: UsersService,
		private jwtService: JwtService
	) {}

	async validateUser(email: string, password: string) {
		const user = await this.userService.findOneByEmail(email);
		if (user && (await bcrypt.compare(password, user.password))) {
			const { password, ...result } = user;
			return result;
		}

		return null;
	}

	async login(user: IUser) {
		const payload = {
			username: user.username,
			email: user.email,
			sub: user.id,
		};

		return {
			access_token: this.jwtService.sign(payload),
			refresh_token: this.jwtService.sign(payload, {
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
}
