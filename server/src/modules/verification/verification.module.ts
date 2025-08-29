import { Module } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { MailModule } from 'src/mail/mail.module';
import { RedisModule } from 'src/redis/redis.module';

@Module({
	imports: [MailModule, RedisModule],
	providers: [VerificationService],
	exports: [VerificationService],
})
export class VerificationModule {}
