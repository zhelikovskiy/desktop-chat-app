import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from 'src/common/dto/messages/create-message.dto';
import { FilterMessage } from 'src/common/types/filter-message.type';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MessagesService {
	constructor(private readonly prismaService: PrismaService) {}

	createOne(senderId: string, dto: CreateMessageDto) {
		return this.prismaService.message.create({
			data: {
				chatId: dto.chatId,
				senderId: senderId,
				content: dto.content,
				replyToMessageId: dto.replyToMessageId,
			},
		});
	}

	findManyByChatId(chatId: string) {
		return this.prismaService.message.findMany({
			where: { chatId },
			include: { replies: true },
			orderBy: { createdAt: 'asc' },
		});
	}

	findManyByFilter(filter: FilterMessage) {
		return this.prismaService.message.findMany({
			where: filter,
			orderBy: { createdAt: 'asc' },
		});
	}

	updateOne() {}
	removeOne() {}
}
