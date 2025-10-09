import {
	ForbiddenException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { CreateMessageDto } from 'src/common/dto/messages/create-message.dto';
import { PrismaService } from 'src/shared/prisma/prisma.service';

@Injectable()
export class MessagesService {
	constructor(private readonly prismaService: PrismaService) {}

	private async verifyChatMembership(userId: string, chatId: string) {
		const chatExists = await this.prismaService.chat.findUnique({
			where: { id: chatId },
		});

		if (!chatExists) {
			throw new NotFoundException('Chat not found.');
		}

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
	}

	sendNewMessage(userId: string, dto: CreateMessageDto) {
		this.verifyChatMembership(userId, dto.chatId);

		return this.prismaService.message.create({
			data: {
				chatId: dto.chatId,
				senderId: userId,
				content: dto.content,
				replyToMessageId: dto.replyToMessageId,
			},
		});
	}

	async getMessagesHistory(userId: string, chatId: string) {
		this.verifyChatMembership(userId, chatId);

		const messages = await this.prismaService.message.findMany({
			where: { chatId: chatId },
			include: { replies: true },
			orderBy: { createdAt: 'asc' },
		});

		return messages;
	}

	updateOne() {}
	removeOne() {}
}
