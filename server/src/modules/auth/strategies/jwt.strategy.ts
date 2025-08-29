import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from '../constants';
import { UsersService } from 'src/modules/users/users.service';
import { IPayload } from 'src/common/interfaces/payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(private userService: UsersService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: jwtConstants.secret,
		});
	}

	async validate(payload: IPayload) {
		const user = await this.userService.findOneById(payload.sub);

		if (!user) {
			throw new UnauthorizedException();
		}

		return {
			sub: payload.sub,
			username: payload.username,
			email: payload.email,
		};
	}
}
