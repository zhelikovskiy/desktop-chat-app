import { Injectable } from '@nestjs/common';
import { MailService } from 'src/mail/mail.service';
import { RedisService } from 'src/redis/redis.service';
import { generateVerificationCode } from './utils/generate-verification-code';
import { UserVerificationDto } from 'src/common/dto/user-verification.dto';

@Injectable()
export class VerificationService {
	constructor(
		private mailService: MailService,
		private redisService: RedisService
	) {}

	async createVerification(data: UserVerificationDto): Promise<void> {
		const code = generateVerificationCode();

		await this.redisService.saveVerification(code, data);

		await this.mailService.sendVerificationCode(
			data.email,
			data.username,
			code
		);
	}
	async confirmVerification(
		code: string
	): Promise<UserVerificationDto | null> {
		const stored: UserVerificationDto | null =
			await this.redisService.getVerification(code);

		if (!stored) return null;

		return stored;
	}
}
