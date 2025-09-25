import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class GetAllMessagesDto {
	@ApiProperty()
	@IsNotEmpty()
	chatId: string;
}
