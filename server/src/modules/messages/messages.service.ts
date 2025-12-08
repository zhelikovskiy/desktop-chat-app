import {
	ForbiddenException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { CreateMessageDto } from 'src/common/dto/messages/create-message.dto';
import { EditMessageDto } from 'src/common/dto/messages/edit-message.dto';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { RealtimeGateway } from 'src/shared/realtime/realtime.gateway';

@Injectable()
export class MessagesService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly realtimeGateway: RealtimeGateway
	) {}

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
				include: {
					sender: {
						select: {
							id: true,
							username: true,
						},
					},
				},
			}),

			//TODO add field 'lastMessageAt' and use instead of 'updatedAt'
			this.prismaService.chat.update({
				where: { id: dto.chatId },
				data: { updatedAt: new Date() },
			}),
		]);

		await this.realtimeGateway.sendNewMessageWS({
			...message,
			tempId: dto.tempId,
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

	async editMessage(messageId: string, userId: string, dto: EditMessageDto) {
		const message = await this.prismaService.message.findUnique({
			where: { id: messageId },
		});

		if (!message) {
			throw new NotFoundException('Message not found.');
		}

		if (message.senderId !== userId) {
			throw new ForbiddenException(
				'You can only edit your own messages.'
			);
		}

		return await this.prismaService.message.update({
			where: { id: messageId },
			data: {
				content: dto.content,
				isEdited: true,
				updatedAt: new Date(),
			},
		});
	}

	async deleteMessage(messageId: string, userId: string) {
		const message = await this.prismaService.message.findUnique({
			where: { id: messageId },
		});

		if (!message) {
			throw new NotFoundException('Message not found.');
		}

		if (message.senderId !== userId) {
			throw new ForbiddenException(
				'You can only delete your own messages.'
			);
		}

		await this.prismaService.message.update({
			where: { id: messageId },
			data: { isDeleted: true },
		});
	}
}
