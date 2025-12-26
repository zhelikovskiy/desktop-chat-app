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
import { SERVER_WS_EVENTS } from 'src/common/ws-events/ws-events.server';
import { CLIENT_WS_EVENTS } from 'src/common/ws-events/ws-events.client';

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

	@SubscribeMessage(CLIENT_WS_EVENTS.CHAT.OPENED)
	private async handleChatOpened(
		@ConnectedSocket() client: Socket,
		data: { chatId: string }
	) {
		client.join(`chat:${data.chatId}`);
	}

	@SubscribeMessage(CLIENT_WS_EVENTS.CHAT.CLOSED)
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
			.emit(
				SERVER_WS_EVENTS.NOTIFICATION.CHAT_CREATED,
				JSON.stringify({ chatBody, messageBody })
			);
	}

	public async sendMessageEvent(
		messageBody: Message & { tempId: string },
		participants: string[]
	) {
		const chatRoom = `chat:${messageBody.chatId}`;

		this.server
			.to(chatRoom)
			.emit(
				SERVER_WS_EVENTS.MESSAGE.RECEIVED,
				JSON.stringify(messageBody)
			);

		for (const userId of participants) {
			if (userId !== messageBody.senderId) {
				const socketsInChat = await this.server
					.in(chatRoom)
					.fetchSockets();
				const isUserInChat = socketsInChat.some(
					(s) => s.data.userId === userId
				);

				if (!isUserInChat) {
					this.server.to(`user:${userId}`).emit(
						SERVER_WS_EVENTS.NOTIFICATION.NEW_MESSAGE,
						JSON.stringify({
							chatId: messageBody.chatId,
							preview: messageBody.content.slice(0, 50),
							messageId: messageBody.id,
						})
					);
				}
			}
		}
	}
}
