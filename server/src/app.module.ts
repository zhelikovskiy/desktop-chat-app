import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './shared/prisma/prisma.module';
import { MailModule } from './shared/mail/mail.module';
import { CacheManagerModule } from './shared/cache-manager/cache-manager.module';
import { VerificationModule } from './modules/verification/verification.module';
import { SwaggerModule } from './shared/swagger/swagger.module';
import { StorageModule } from './shared/storage/storage.module';
import { FilesModule } from './modules/files/files.module';
import { ChatsModule } from './modules/chats/chats.module';
import { MessagesModule } from './modules/messages/messages.module';
import { ConfigModule } from '@nestjs/config';
import { RealtimeModule } from './shared/realtime/realtime.module';

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
		RealtimeModule,
	],
	controllers: [],
	providers: [AppService],
})
export class AppModule {}
