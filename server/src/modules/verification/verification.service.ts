import { Injectable } from '@nestjs/common';
import { MailService } from 'src/shared/mail/mail.service';
import { CacheManagerService } from 'src/shared/cache-manager/cache-manager.service';
import { generateVerificationCode } from './utils/generate-verification-code';
import { UserVerificationDto } from 'src/common/dto/auth/user-verification.dto';
import { VerifyEmailDto } from 'src/common/dto/auth/verify-email.dto';

@Injectable()
export class VerificationService {
	constructor(
		private mailService: MailService,
		private cacheManager: CacheManagerService
	) {}

	async createVerification(data: UserVerificationDto): Promise<void> {
		const code = generateVerificationCode();

		const isExist = await this.cacheManager.get(
			`verify:${code}-${data.email}`
		);

		if (isExist)
			await this.cacheManager.del(`verify:${code}-${data.email}`);

		await this.cacheManager.set(
			`verify:${code}-${data.email}`,
			data,
			60 * 10
		);

		await this.mailService.sendVerificationCode(
			data.email,
			data.username,
			code
		);
	}

	async confirmVerification(
		data: VerifyEmailDto
	): Promise<UserVerificationDto | null> {
		const stored: UserVerificationDto | null = await this.cacheManager.get(
			`verify:${data.code}-${data.email}`
		);

		if (stored) {
			await this.cacheManager.del(`verify:${data.code}-${data.email}`);
			return stored;
		}

		return null;
	}
}
