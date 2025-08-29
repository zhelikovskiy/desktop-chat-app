import { IsNotEmpty } from 'class-validator';

export class UploadFileDto {
	@IsNotEmpty()
	name: string;

	@IsNotEmpty()
	key: string;

	@IsNotEmpty()
	size: number;

	@IsNotEmpty()
	mimeType: string;

	@IsNotEmpty()
	status: 'TEMP' | 'PERMANENT';
}
