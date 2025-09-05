import {
	Body,
	Controller,
	Delete,
	Get,
	Post,
	Req,
	UseGuards,
} from '@nestjs/common';
import { ChatsService } from './chats.service';
import { Request } from 'express';
import { CreatePrivateChatDto } from 'src/common/dto/chats/create-private-chat.dto';
import { AuthGuard } from '@nestjs/passport';
import { ChatType } from 'src/common/enums/chat-types';
import { ApiCreatePrivateChatDocs } from './docs/create-private-chat.docs';
import { ApiCreateGroupChatDocs } from './docs/create-group-chat.docs';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Chats')
@UseGuards(AuthGuard('jwt'))
@Controller('chats')
export class ChatsController {
	constructor(private readonly chatsService: ChatsService) {}

	@ApiCreatePrivateChatDocs()
	@Post('/private')
	async createPrivateChat(
		@Req() req: Request,
		@Body() dto: CreatePrivateChatDto
	) {
		const userId = req.user!['sub'];

		return await this.chatsService.createOne(userId, {
			...dto,
			type: ChatType.PRIVATE,
		});
	}

	@ApiCreateGroupChatDocs()
	@Post('/group')
	async createGroupChat(@Req() req: Request, @Body() dto: any) {
		const userId = req.user!['sub'];

		return await this.chatsService.createOne(userId, {
			...dto,
			type: ChatType.GROUP,
		});
	}

	@Get()
	async getAllUsersChats(@Req() req: Request) {
		const userId = req.user!['id'];

		return await this.chatsService.findAllByUserId(userId);
	}

	@Delete('')
	async deleteChat(@Req() req: Request, @Body('chatId') chatId: string) {
		const userId = req.user!['sub'];

		return await this.chatsService.deleteOne(userId, chatId);
	}
}
