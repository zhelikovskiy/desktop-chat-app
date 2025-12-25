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
		const userId = (client as any).user.sub;

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

	public async sendChatCreatedEvent(
		chatId: string,
		chatBody: Chat,
		messageBody: Message & { tempId: string }
	) {
		this.server
			.to(chatBody.id)
			.emit('chat:created', { chatBody, messageBody });

		this.server
			.to(`user:${chatBody}`)
			.emit('chat:created', { chatBody, messageBody });
	}

	// public async sendMessageEvent(messageBody: Message & { tempId: string }) {
	// 	this.server
	// 		.to(`chat:${messageBody.chatId}`)
	// 		.emit('message:sended', messageBody);

	// 	const socketsInRoom = await this.server
	// 		.in(`chat:${messageBody.chatId}`)
	// 		.fetchSockets();

	// 	const preview =
	// 		typeof messageBody.content === 'string'
	// 			? messageBody.content.slice(0, 120)
	// 			: '';

	// 	const notifyPayload = {
	// 		messageId: messageBody.id,
	// 		chatId: messageBody.chatId,
	// 		senderId: messageBody.senderId,
	// 		createdAt: messageBody.createdAt,
	// 		tempId: messageBody.tempId,
	// 		preview,
	// 	};

	// 	for(const userId OF )

	// 	this.server.to(messageBody.chatId).emit('message:sended', messageBody);
	// }
}
