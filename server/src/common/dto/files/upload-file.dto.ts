import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UploadFileDto {
	@ApiProperty()
	@IsNotEmpty()
	name: string;

	@ApiProperty()
	@IsNotEmpty()
	key: string;

	@ApiProperty()
	@IsNotEmpty()
	size: number;

	@ApiProperty()
	@IsNotEmpty()
	mimeType: string;

	@ApiProperty()
	@IsNotEmpty()
	status: 'TEMP' | 'PERMANENT';
}
