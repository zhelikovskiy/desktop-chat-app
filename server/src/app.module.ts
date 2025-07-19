import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { UserService } from './user/user.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
	imports: [UsersModule, AuthModule, PrismaModule],
	controllers: [AppController],
	providers: [AppService, UserService],
})
export class AppModule {}
