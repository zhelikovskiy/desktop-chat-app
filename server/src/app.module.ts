import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { MailModule } from './mail/mail.module';
import { CacheManagerModule } from './cache-manager/cache-manager';
import { VerificationModule } from './modules/verification/verification.module';
import { SwaggerModule } from './swagger/swagger.module';
import { StorageModule } from './modules/storage/storage.module';
import { FilesModule } from './modules/files/files.module';
import { ChatsModule } from './modules/chats/chats.module';
import { MessagesModule } from './modules/messages/messages.module';
import { ConfigModule } from '@nestjs/config';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: [`.env.development`, `.env`],
		}),

		MailModule,
		UsersModule,
		AuthModule,
		PrismaModule,
		CacheManagerModule,
		VerificationModule,
		SwaggerModule,
		StorageModule,
		FilesModule,
		ChatsModule,
		MessagesModule,
	],
	controllers: [],
	providers: [AppService],
})
export class AppModule {}
