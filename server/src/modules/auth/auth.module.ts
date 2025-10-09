import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/modules/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { VerificationModule } from 'src/modules/verification/verification.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
	imports: [
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => ({
				secret: configService.get<string>('JWT_SECRET'),
				signOptions: {
					expiresIn: configService.get<string>('JWT_EXPIRES_IN'),
				},
			}),
			global: true,
			inject: [ConfigService],
		}),
		UsersModule,
		PassportModule,
		VerificationModule,
	],
	controllers: [AuthController],
	providers: [AuthService, JwtStrategy],
	exports: [JwtModule, AuthService],
})
export class AuthModule {}
