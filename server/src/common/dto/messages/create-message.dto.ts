import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

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

	@ApiProperty()
	@IsNotEmpty()
	@IsUUID()
	tempId: string;
}
