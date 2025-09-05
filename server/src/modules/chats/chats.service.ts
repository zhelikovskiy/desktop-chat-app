import { Injectable } from '@nestjs/common';
import { ChatRole, ChatType } from 'generated/prisma';
import { CreateChatDto } from 'src/common/dto/chats/create-chat.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChatsService {
	constructor(private prismaService: PrismaService) {}

	async createOne(userId: string, dto: CreateChatDto) {
		const newChat = await this.prismaService.$transaction(
			async (prisma) => {
				if (dto.type === ChatType.PRIVATE) {
					const existingUser = await prisma.user.findUnique({
						where: { id: dto.targetId },
					});

					if (!existingUser) {
						throw new Error('Target user does not exist');
					}

					const existingChat = await prisma.chat.findFirst({
						where: {
							type: ChatType.PRIVATE,
							members: {
								every: {
									userId: {
										in: [userId, dto.targetId],
									},
								},
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
										{ userId, role: ChatRole.ADMIN },
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

					return { newChat };
				}
			}
		);

		return newChat;
	}

	async findAllByUserId(userId: string) {
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
