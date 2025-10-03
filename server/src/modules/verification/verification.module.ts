import { Module } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { MailModule } from 'src/shared/mail/mail.module';
import { CacheManagerModule } from 'src/shared/cache-manager/cache-manager.module';

@Module({
	imports: [MailModule, CacheManagerModule],
	providers: [VerificationService],
	exports: [VerificationService],
})
export class VerificationModule {}
