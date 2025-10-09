import { Body, Controller, Get, Post } from '@nestjs/common';
import { PrismaService } from './shared/prisma/prisma.service';
import { AuthService } from './modules/auth/auth.service';

@Controller('app')
export class AppController {
	constructor(
		private prismaService: PrismaService,
		private authService: AuthService
	) {}

	@Get('clear-data')
	async clearData() {
		Promise.all([
			this.prismaService.user.deleteMany(),
			this.prismaService.chat.deleteMany(),
			this.prismaService.chatMember.deleteMany(),
			this.prismaService.message.deleteMany(),
			this.prismaService.file.deleteMany(),
		])
			.then(() => {
				console.log('Data cleared');
			})
			.catch((error) => {
				console.error('Error clearing data:', error);
			});
		return { message: 'Data clearing initiated' };
	}

	@Post('new-user')
	async createUser(
		@Body()
		dto: {
			username: string;
			email: string;
			password: string;
		}
	) {
		return this.authService.register(dto);
	}
}
