import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreatePrivateChatDto {
	@ApiProperty()
	@IsNotEmpty()
	targetId: string;
}
