import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateMessageDto {
	@ApiProperty()
	@IsNotEmpty()
	content: string;

	@ApiProperty()
	@IsNotEmpty()
	chatId: string;

	@ApiProperty()
	@IsOptional()
	replyToMessageId?: string;
}
