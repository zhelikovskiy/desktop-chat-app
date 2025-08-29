import { memoryStorage } from 'multer';
import { Module } from '@nestjs/common';
import { MinioStorageService } from './services/minio-storage.service';
import { MulterModule } from '@nestjs/platform-express';
import { STORAGE_SERVICE } from './storage.interface';

@Module({
	imports: [
		MulterModule.register({
			storage: memoryStorage(),
			limits: { fileSize: 10 * 1024 * 1024 },
		}),
	],
	providers: [
		{
			provide: STORAGE_SERVICE,
			useClass: MinioStorageService,
		},
	],
	controllers: [],
	exports: [STORAGE_SERVICE],
})
export class StorageModule {}

