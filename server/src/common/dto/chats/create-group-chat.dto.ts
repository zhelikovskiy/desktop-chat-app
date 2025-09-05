import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateGroupChatDto {
	@ApiProperty()
	@IsNotEmpty()
	name: string;

	@ApiProperty()
	@IsOptional()
	avatarUrl?: string;

	@ApiProperty()
	@IsOptional()
	membersIdsToInvate?: string[];
}
