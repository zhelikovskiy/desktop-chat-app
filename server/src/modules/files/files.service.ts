import {
	BadRequestException,
	Inject,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common';
import {
	STORAGE_SERVICE,
	StorageService,
} from 'src/shared/storage/storage.interface';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { FileCategories } from 'src/common/enums/file-categories';
import { checkFileType } from './utils/check-file-type';
import { equal } from 'assert';

@Injectable()
export class FilesService {
	constructor(
		private prismaService: PrismaService,
		@Inject(STORAGE_SERVICE) private storageService: StorageService
	) {}

	async uploadAndSaveFile(
		userId: string,
		category: FileCategories,
		file: Express.Multer.File
	) {
		checkFileType(file.mimetype, category);

		const fileKey = await this.storageService.upload(file, category);

		if (!fileKey)
			throw new InternalServerErrorException('Upload file error');

		const fileUrl = await this.storageService.getUrl(fileKey);

		try {
			return this.prismaService.file.create({
				data: {
					name: file.originalname,
					key: fileKey,
					size: file.size,
					mimeType: file.mimetype,
					url: fileUrl,
					userId: userId,
				},
			});
		} catch (error) {
			await this.storageService.delete(fileKey);
			throw error;
		}
	}

	async getFileStream(fileKey: string) {
		return await this.storageService.getFileStream(fileKey);
	}

	async getOneById(fileId: string) {
		return await this.prismaService.file.findFirst({
			where: { id: fileId },
		});
	}

	async getAll() {
		return this.prismaService.file.findMany();
	}

	async getFileUrl(fileId: string) {
		const file = await this.prismaService.file.findFirst({
			where: { id: fileId },
		});

		if (!file)
			throw new NotFoundException(`File with id ${fileId} not found`);

		return this.storageService.getUrl(file.key);
	}
}
