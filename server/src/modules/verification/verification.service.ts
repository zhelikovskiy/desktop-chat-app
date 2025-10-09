import { Injectable } from '@nestjs/common';
import { MailService } from 'src/shared/mail/mail.service';
import { CacheManagerService } from 'src/shared/cache-manager/cache-manager.service';
import { generateVerificationCode } from './utils/generate-verification-code';
import { UserVerificationDto } from 'src/common/dto/auth/user-verification.dto';
import { VerifyEmailDto } from 'src/common/dto/auth/verify-email.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class VerificationService {
	constructor(
		private mailService: MailService,
		private cacheManager: CacheManagerService,
		private configService: ConfigService
	) {}

	async createVerification(data: UserVerificationDto): Promise<void> {
		const code = generateVerificationCode();

		const isExist = await this.cacheManager.get(
			this.generateCacheKey(code, data.email)
		);

		if (isExist)
			await this.cacheManager.del(
				this.generateCacheKey(code, data.email)
			);

		await this.cacheManager.set(
			this.generateCacheKey(code, data.email),
			data,
			5 * 60 * 100
		);

		if (this.configService.get<string>('NODE_ENV') === 'production') {
			await this.mailService.sendVerificationCode(
				data.email,
				data.username,
				code
			);
		} else {
			console.log('Verification code:', code);
		}

		return;
	}

	async confirmVerification(
		data: VerifyEmailDto
	): Promise<UserVerificationDto | null> {
		const stored: UserVerificationDto | null = await this.cacheManager.get(
			this.generateCacheKey(data.code, data.email)
		);

		if (stored) {
			await this.cacheManager.del(
				this.generateCacheKey(data.code, data.email)
			);
			return stored;
		}

		return null;
	}

	generateCacheKey(code: string, email: string): string {
		return `verify:${code}-${email}`;
	}
}
