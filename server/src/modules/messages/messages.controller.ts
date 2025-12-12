import {
	Body,
	Controller,
	Get,
	Param,
	Post,
	Put,
	Req,
	UseGuards,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from 'src/common/dto/messages/create-message.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { EditMessageDto } from 'src/common/dto/messages/edit-message.dto';

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
	async sendNewMessage(@Req() req: Request, @Body() dto: CreateMessageDto) {
		const userId = req.user!['sub'];

		await this.messagesService.createMessage(userId, dto);

		return { message: 'Message sent successfully' };
	}

	@Put(':messageId')
	editMessage(
		@Req() req: Request,
		@Param('messageId') messageId: string,
		@Body() dto: EditMessageDto
	) {
		const userId = req.user!['sub'];

		return this.messagesService.editMessage(userId, messageId, dto);
	}
}
