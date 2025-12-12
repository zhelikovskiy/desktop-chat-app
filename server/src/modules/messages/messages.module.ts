import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { PrismaModule } from 'src/shared/prisma/prisma.module';

@Module({
	imports: [PrismaModule],
	providers: [MessagesService],
	controllers: [MessagesController],
	exports: [MessagesService],
})
export class MessagesModule {}
