import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { MailModule } from './mail/mail.module';
import { RedisModule } from './redis/redis.module';
import { VerificationModule } from './modules/verification/verification.module';
import { SwaggerModule } from './swagger/swagger.module';
import { StorageModule } from './modules/storage/storage.module';
import { FilesModule } from './modules/files/files.module';

@Module({
	imports: [
		MailModule,
		UsersModule,
		AuthModule,
		PrismaModule,
		RedisModule,
		VerificationModule,
		SwaggerModule,
		StorageModule,
		FilesModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
