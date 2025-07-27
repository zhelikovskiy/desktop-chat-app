import { Body, Controller, Post } from '@nestjs/common';
import { MailService } from './mail.service';
import { VerificationDto } from './dto/verification.dto';

@Controller('mail')
export class MailController {
	constructor(private mailService: MailService) {}

	@Post('verify')
	sendVerificationEmail(@Body() verifyData: VerificationDto): Promise<void> {
		return this.mailService.sendVerificationEmail(
			verifyData.email,
			verifyData.username,
			'link'
		);
	}
}
