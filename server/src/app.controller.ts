import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './shared/prisma/prisma.service';

@Controller('app')
export class AppController {
	constructor(private prismaService: PrismaService) {}

	@Get()
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
}
