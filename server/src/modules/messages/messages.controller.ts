import {
	Body,
	Controller,
	Get,
	Param,
	Post,
	Req,
	UseGuards,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from 'src/common/dto/messages/create-message.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUnreadMessagesDto } from 'src/common/dto/messages/get-unread-messages.dto';
import { Request } from 'express';

@UseGuards(AuthGuard('jwt'))
@Controller('messages')
export class MessagesController {
	constructor(private readonly messagesService: MessagesService) {}

	@Get()
	getUnreadMessages(@Body() dto: GetUnreadMessagesDto) {
		const filter = {
			chatId: dto.chatId,
			id: { gt: dto.lastMessageId },
		};

		return this.messagesService.findManyByFilter(filter);
	}

	@Get('history/:chatId')
	async getChatHistory(@Req() req: Request, @Param('chatId') chatId: string) {
		const userId = req.user!['sub'];

		return await this.messagesService.getChatHistory(userId, chatId);
	}

	@Post()
	sendNewMessage(@Req() req: Request, @Body() dto: CreateMessageDto) {
		const userId = req.user!['sub'];

		return this.messagesService.createOne(userId, dto);
	}
}
