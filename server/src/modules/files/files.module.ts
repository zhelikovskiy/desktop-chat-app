import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { StorageModule } from 'src/shared/storage/storage.module';
import { PrismaModule } from 'src/shared/prisma/prisma.module';

@Module({
	imports: [StorageModule, PrismaModule],
	providers: [FilesService],
	controllers: [FilesController],
})
export class FilesModule {}

