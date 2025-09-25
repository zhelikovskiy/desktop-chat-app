import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class GetUnreadMessagesDto {
	@ApiProperty()
	@IsNotEmpty()
	chatId: string;

	@ApiProperty()
	@IsNotEmpty()
	lastMessageId: string;
}
