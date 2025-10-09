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

	@Get('history/:chatId')
	getMessagesHistory(@Req() req: Request, @Param('chatId') chatId: string) {
		const userId = req.user!['sub'];

		return this.messagesService.getMessagesHistory(userId, chatId);
	}

	@Post()
	sendNewMessage(@Req() req: Request, @Body() dto: CreateMessageDto) {
		const userId = req.user!['sub'];

		return this.messagesService.sendNewMessage(userId, dto);
	}
}
