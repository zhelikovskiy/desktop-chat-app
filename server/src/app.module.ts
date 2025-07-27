import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { MailModule } from './mail/mail.module';

@Module({
	imports: [MailModule, UsersModule, AuthModule, PrismaModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
