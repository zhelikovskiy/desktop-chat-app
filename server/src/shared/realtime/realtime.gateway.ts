import { JwtService } from '@nestjs/jwt';
import {
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
	ConnectedSocket,
} from '@nestjs/websockets';
import { Chat, Message } from 'generated/prisma';
import { Server, Socket } from 'socket.io';
import { CacheManagerService } from '../cache-manager/cache-manager.service';

@WebSocketGateway({
	cors: {
		origin: '*',
		credentials: true,
	},
})
export class RealtimeGateway
	implements OnGatewayConnection, OnGatewayDisconnect
{
	@WebSocketServer()
	server: Server;

	constructor(
		private readonly jwtService: JwtService,
		private readonly cacheManagerService: CacheManagerService
	) {}

	async handleConnection(client: Socket) {
		const token =
			client.handshake.auth?.token ||
			client.handshake.headers.authorization;
		const user = await this.jwtService.verifyAsync(token);

		if (!user) {
			client.disconnect(true);
			return;
		}

		client.data.userId = user.sub;

		this.cacheManagerService.addSocket(user.sub, client.id);

		client.join(`user:${user.sub}`);

		console.log(`Client connected: ${client.id}, User ID: ${user.sub}`);
	}

	handleDisconnect(client: Socket) {
		const userId = client.data.userId;

		this.cacheManagerService.removeSocket(userId, client.id);

		console.log(`Client disconnected: ${client.id}, User ID: ${userId}`);
	}

	@SubscribeMessage('chat_opened')
	private async handleChatOpened(
		@ConnectedSocket() client: Socket,
		data: { chatId: string }
	) {
		client.join(`chat:${data.chatId}`);
	}

	@SubscribeMessage('chat_closed')
	private async handleChatClosed(
		@ConnectedSocket() client: Socket,
		data: { chatId: string }
	) {
		client.leave(`chat:${data.chatId}`);
	}

	public async sendPrivateChatCreatedEvent(
		targetUserId: string,
		chatBody: Chat,
		messageBody: Message & { tempId: string }
	) {
		this.server
			.to(`user:${targetUserId}`)
			.emit('chat:created', { chatBody, messageBody });
	}

	public async sendMessageEvent(
		messageBody: Message & { tempId: string },
		participants: string[]
	) {
		const chatRoom = `chat:${messageBody.chatId}`;

		this.server.to(chatRoom).emit('message:received', messageBody);

		for (const userId of participants) {
			if (userId !== messageBody.senderId) {
				const socketsInChat = await this.server
					.in(chatRoom)
					.fetchSockets();
				const isUserInChat = socketsInChat.some(
					(s) => s.data.userId === userId
				);

				if (!isUserInChat) {
					this.server
						.to(`user:${userId}`)
						.emit('notification:new_message', {
							chatId: messageBody.chatId,
							preview: messageBody.content.slice(0, 50),
							messageId: messageBody.id,
						});
				}
			}
		}
	}
}
