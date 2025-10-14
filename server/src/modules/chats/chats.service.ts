import { Injectable, NotFoundException } from '@nestjs/common';
import { ChatRole, ChatType } from 'generated/prisma';
import { CreateChatDto } from 'src/common/dto/chats/create-chat.dto';
import { PrismaService } from 'src/shared/prisma/prisma.service';

@Injectable()
export class ChatsService {
	constructor(private prismaService: PrismaService) {}

	async createNewChat(userId: string, dto: CreateChatDto) {
		const newChat = await this.prismaService.$transaction(
			async (prisma) => {
				if (dto.type === ChatType.PRIVATE) {
					const existingUser = await prisma.user.findUnique({
						where: { id: dto.targetId },
					});

					if (!existingUser) {
						throw new NotFoundException(
							'Target user does not exist'
						);
					}

					const existingChat = await prisma.chat.findFirst({
						where: {
							type: ChatType.PRIVATE,
							members: {
								some: { userId: dto.targetId },
							},
							AND: {
								members: { some: { userId: userId } },
							},
						},
						include: { members: true },
					});

					if (existingChat) {
						return existingChat;
					}

					const newChat = await prisma.chat.create({
						data: {
							type: dto.type,
							members: {
								createMany: {
									data: [
										{
											userId: userId,
											role: ChatRole.ADMIN,
										},
										{
											userId: dto.targetId,
											role: ChatRole.ADMIN,
										},
									],
								},
							},
						},
						include: { members: true },
					});

					return newChat;
				} else if (dto.type === ChatType.GROUP) {
					const newChat = await prisma.chat.create({
						data: {
							name: dto.name,
							type: dto.type,
							avatarUrl: dto.avatarUrl,
							members: {
								create: {
									userId,
									role: ChatRole.ADMIN,
								},
							},
						},
						include: { members: true },
					});

					return newChat;
				} else {
					throw new NotFoundException('Chat type not supported');
				}
			}
		);

		return newChat;
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
				where: { chatId, userId, role: ChatRole.ADMIN },
			});

		if (!existringMembership) {
			throw new Error('Only admins can delete the chat');
		}

		return await this.prismaService.chat.delete({
			where: { id: chatId },
		});
	}
}
