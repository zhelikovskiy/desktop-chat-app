import {
	ForbiddenException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { CreateMessageDto } from 'src/common/dto/messages/create-message.dto';
import { FilterMessage } from 'src/common/types/filter-message.type';
import { PrismaService } from 'src/shared/prisma/prisma.service';

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

	async getChatHistory(userId: string, chatId: string) {
		const isMember = await this.prismaService.chatMember.findUnique({
			where: {
				chatId_userId: {
					chatId: chatId,
					userId: userId,
				},
			},
		});

		if (!isMember) {
			throw new ForbiddenException('User is not a member of this chat.');
		}

		const messages = await this.prismaService.message.findMany({
			where: { chatId: chatId },
			include: { replies: true },
			orderBy: { createdAt: 'asc' },
		});

		return messages;
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
