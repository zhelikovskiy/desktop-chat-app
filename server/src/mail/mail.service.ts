import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
	constructor(private mailerService: MailerService) {}

	async sendVerificationCode(email: string, username: string, code: string) {
		await this.mailerService.sendMail({
			to: email,
			subject: 'Account Verification',
			template: 'code',
			context: {
				username,
				code,
			},
		});
	}
}
