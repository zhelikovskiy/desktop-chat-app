import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { firstMessageDto } from '../messages/first-message.dto';
import { Type } from 'class-transformer';

export class CreatePrivateChatDto {
	@ApiProperty()
	@IsNotEmpty()
	targetId: string;

	@ApiProperty({ type: firstMessageDto })
	@ValidateNested()
	@Type(() => firstMessageDto)
	firstMessage: firstMessageDto;
}
