import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class EditMessageDto {
	@ApiProperty()
	@IsNotEmpty()
	content: string;
}
