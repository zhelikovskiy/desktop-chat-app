import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
	constructor(private mailerService: MailerService) {}

	async sendVerificationEmail(to: string, name: string, link: string) {
		try {
			await this.mailerService.sendMail({
				to,
				subject: 'Email Verification',
				template: 'welcome',
				context: {
					link,
					name,
				},
			});
		} catch (error) {
			throw new HttpException('Failed to send verification email', 500);
		}
	}
}
