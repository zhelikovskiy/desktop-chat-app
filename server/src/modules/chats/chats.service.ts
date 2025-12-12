import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { Chat, ChatRole, ChatType, Message } from 'generated/prisma';
import { CreateGroupChatDto } from 'src/common/dto/chats/create-group-chat.dto';
import { CreatePrivateChatDto } from 'src/common/dto/chats/create-private-chat.dto';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { RealtimeGateway } from 'src/shared/realtime/realtime.gateway';

@Injectable()
export class ChatsService {
	constructor(
		private prismaService: PrismaService,
		private readonly realtimeGateway: RealtimeGateway
	) {}

	private async _isPrivateChatExist(userId: string, targetId: string) {
		return this.prismaService.chat.findFirst({
			where: {
				type: ChatType.PRIVATE,
				AND: [
					{ members: { some: { userId } } },
					{ members: { some: { userId: targetId } } },
				],
				members: {
					every: { userId: { in: [userId, targetId] } },
				},
			},
			include: { members: true },
		});
	}

	//TODO move work with message into separatemethod, if necessary
	public async createPrivateChat(userId: string, dto: CreatePrivateChatDto) {
		if (userId === dto.targetId)
			return new BadRequestException(
				'You cannot create a chat with yourself'
			);

		const existingChat = await this._isPrivateChatExist(
			userId,
			dto.targetId
		);

		if (existingChat) {
			return this.prismaService.$transaction(async (prisma) => {
				const createdMessage = await prisma.message.create({
					data: {
						chatId: existingChat.id,
						senderId: userId,
						content: dto.firstMessage.content,
					},
				});

				const messageBodyResponse = {
					...createdMessage,
					tempId: dto.firstMessage.tempId,
				};

				await this.realtimeGateway.sendMessageEvent(
					messageBodyResponse
				);

				return { existingChat, newMessage: messageBodyResponse };
			});
		} else {
			return this.prismaService.$transaction(async (prisma) => {
				const targetUser = await prisma.user.findUnique({
					where: { id: dto.targetId },
				});

				if (!targetUser)
					throw new NotFoundException('Target user does not exist');

				const createdChat = await prisma.chat.create({
					data: {
						type: ChatType.PRIVATE,
						members: {
							createMany: {
								data: [
									{ userId, role: ChatRole.OWNER },
									{
										userId: dto.targetId,
										role: ChatRole.OWNER,
									},
								],
							},
						},
					},
				});

				const createdMessage = await prisma.message.create({
					data: {
						chatId: createdChat.id,
						senderId: userId,
						content: dto.firstMessage.content,
					},
				});

				const messageBodyResponse = {
					...createdMessage,
					tempId: dto.firstMessage.tempId,
				};

				await this.realtimeGateway.sendChatCreatedEvent(
					createdChat,
					messageBodyResponse
				);

				return {
					newChat: createdChat,
					newMessage: messageBodyResponse,
				};
			});
		}
	}

	public async createGroupChat(userId: string, dto: CreateGroupChatDto) {
		return this.prismaService.$transaction(async (prisma) => {
			return prisma.chat.create({
				data: {
					name: dto.name,
					type: ChatType.GROUP,
					avatarUrl: dto.avatarUrl,
					members: {
						create: {
							userId,
							role: ChatRole.OWNER,
						},
					},
				},
				include: { members: true },
			});
		});
	}

	async getUserChatsList(userId: string) {
		return await this.prismaService.chat.findMany({
			where: {
				members: { some: { userId } },
			},
			include: {
				members: true,
				messages: { take: 1, orderBy: { createdAt: 'desc' } },
			},
			orderBy: { updatedAt: 'desc' },
		});
	}

	async deleteOne(userId: string, chatId: string) {
		const existringMembership =
			await this.prismaService.chatMember.findFirst({
				where: { chatId, userId, role: ChatRole.OWNER },
			});

		if (!existringMembership) {
			throw new Error('Only admins can delete the chat');
		}

		return await this.prismaService.chat.delete({
			where: { id: chatId },
		});
	}
}
