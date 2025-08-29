import {
	BadRequestException,
	Controller,
	Get,
	NotFoundException,
	Param,
	Post,
	Req,
	Res,
	UploadedFile,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response, Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { FileCategories } from 'src/common/enums/file-categories';

@UseGuards(AuthGuard('jwt'))
@Controller('files')
export class FilesController {
	constructor(private filesService: FilesService) {}

	@Post('avatar')
	@UseInterceptors(FileInterceptor('avatar'))
	async uploadAvatar(
		@Req() req: Request,
		@UploadedFile() file: Express.Multer.File
	) {
		if (!file) throw new BadRequestException('File is required');

		const fileRecord = await this.filesService.uploadAndSaveFile(
			req!.user!['sub'],
			FileCategories.AVATAR,
			file
		);

		return { url: fileRecord.url, id: fileRecord.id };
	}

	@Post()
	@UseInterceptors(FileInterceptor('file'))
	async uploadFile(
		@Req() req: Request,
		@UploadedFile() file: Express.Multer.File
	) {
		if (!file) throw new BadRequestException('File is required');

		const fileRecord = await this.filesService.uploadAndSaveFile(
			req!.user!['sub'],
			FileCategories.CHAT_FILE,
			file
		);

		return { url: fileRecord.url, id: fileRecord.id };
	}

	@Get(':fileId')
	async downloadFile(@Param('fileId') fileId: string, @Res() res: Response) {
		const fileRecord = await this.filesService.getOneById(fileId);

		if (!fileRecord)
			throw new NotFoundException(`File with id ${fileId} not found`);

		const fileStream = await this.filesService.getFileStream(
			fileRecord.key
		);

		if (!fileStream)
			throw new NotFoundException(
				`File with id ${fileId} not found in storage`
			);

		res.setHeader('Content-Type', fileRecord.mimeType);
		res.setHeader(
			'Content-Disposition',
			`attachment; filename=${fileRecord.name}`
		);

		fileStream.pipe(res);
	}

	@Get()
	async getAll() {
		return this.filesService.getAll();
	}
}
