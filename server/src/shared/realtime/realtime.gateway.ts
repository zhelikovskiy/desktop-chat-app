import { JwtService } from '@nestjs/jwt';
import {
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
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

	constructor(private readonly jwtService: JwtService) {}

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
		const userId = (client as any).userId;
		console.log(`Client connected: ${client.id}, User ID: ${userId}`);

		client.join(userId);
	}

	handleDisconnect(client: Socket) {
		const userId = (client as any).userId;
		console.log(`Client disconnected: ${client.id}, User ID: ${userId}`);
	}

	public emitMessage(chatId: string, payload: any) {
		this.server.to(chatId).emit('new_message', payload);
	}
}
