import { Injectable } from '@nestjs/common';
import { MailService } from 'src/mail/mail.service';
import { RedisService } from 'src/redis/redis.service';
import { generateVerificationCode } from './utils/generate-verification-code';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { CreateVerificationDto } from './dto/create-verification.dto';

@Injectable()
export class VerificationService {
	constructor(
		private mailService: MailService,
		private redisService: RedisService
	) {}

	async createVerification(data: CreateVerificationDto): Promise<void> {
		const code = generateVerificationCode();

		await this.redisService.saveVerification(code, data);

		await this.mailService.sendVerificationCode(
			data.email,
			data.username,
			code
		);
	}
	async confirmVerification(code: string): Promise<RegisterDto | null> {
		const stored = await this.redisService.getVerification(code);

		if (!stored) return null;

		return stored;
	}
}
