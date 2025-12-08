import { JwtService } from '@nestjs/jwt';
import {
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
	ConnectedSocket,
} from '@nestjs/websockets';
import { Message } from 'generated/prisma';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
	cors: {
		origin: '*',
		credentials: true,
	},
})
export class RealtimeGateway
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	@WebSocketServer()
	server: Server;
	//rework socket Map with redis
	sockets: Map<string, Socket[]>;

	constructor(private readonly jwtService: JwtService) {
		this.sockets = new Map<string, Socket[]>();
	}

	afterInit(server: Server) {
		server.use(async (socket: Socket, next) => {
			const token = socket.handshake.auth.token;

			if (!token) {
				return next(
					new Error('Authentication failed: No token provided')
				);
			}

			try {
				const payload = await this.jwtService.verifyAsync(token);

				(socket as any).user = payload;
				next();
			} catch (error) {
				return next(new Error('Authentication failed: Invalid token'));
			}
		});
	}

	async handleConnection(client: Socket) {
		const userId = (client as any).user.sub;

		if (this.sockets.has(userId)) {
			const existingSockets = this.sockets.get(userId);

			if (!existingSockets)
				throw new Error(
					'Socket map error: No existing sockets found for connected user'
				);

			if (existingSockets.find((socket) => socket.id === client.id))
				return;
			existingSockets.push(client);
			this.sockets.set(userId, existingSockets);
		} else {
			this.sockets.set(userId, [client]);
		}

		console.log(`Client connected: ${client.id}, User ID: ${userId}`);

		client.join(userId);
	}

	handleDisconnect(client: Socket) {
		const userId = (client as any).user.sub;

		const existingSockets = this.sockets.get(userId);

		if (!existingSockets)
			throw new Error(
				'Socket map error: No existing sockets found for connected user'
			);

		const updatedSockets = existingSockets.filter(
			(socket) => socket.id !== client.id
		);

		if (updatedSockets.length === 0) this.sockets.delete(userId);
		else {
			this.sockets.set(userId, updatedSockets);
		}

		console.log(`Client disconnected: ${client.id}, User ID: ${userId}`);
	}

	public async subscribeUsersToChat(chatId: string, usersId: string[]) {
		usersId.forEach((id) => {
			this.server.to(id).socketsJoin(chatId);
		});
	}

	@SubscribeMessage('get_sockets')
	public handleGetSockets(@ConnectedSocket() client: Socket) {
		const connectedUsers: { [userId: string]: string[] } = {};

		for (const [userId, sockets] of this.sockets.entries()) {
			connectedUsers[userId] = sockets.map((socket) => socket.id);
		}

		console.log(connectedUsers);

		client.emit('sockets', JSON.stringify(connectedUsers));
	}

	public async sendNewMessageWS(messageBody: Message & { tempId: string }) {
		this.server.to(messageBody.chatId).emit('new_message', messageBody);
	}
}
