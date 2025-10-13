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
		const membership = await this.prismaService.chatMember.findUnique({
			where: {
				chatId_userId: {
					chatId: chatId,
					userId: userId,
				},
			},
			include: { chat: true },
		});

		if (!membership) {
			throw new ForbiddenException('User is not a member of this chat.');
		}

		if (!membership.chat) {
			throw new NotFoundException('Chat not found.');
		}
	}

	async sendNewMessage(userId: string, dto: CreateMessageDto) {
		await this.verifyChatMembership(userId, dto.chatId);

		const [message] = await this.prismaService.$transaction([
			this.prismaService.message.create({
				data: {
					chatId: dto.chatId,
					senderId: userId,
					content: dto.content,
					replyToMessageId: dto.replyToMessageId,
				},
			}),

			this.prismaService.chat.update({
				where: { id: dto.chatId },
				data: { updatedAt: new Date() },
			}),
		]);

		return message;
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
