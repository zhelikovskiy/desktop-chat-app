import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { StorageModule } from 'src/modules/storage/storage.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
	imports: [StorageModule, PrismaModule],
	providers: [FilesService],
	controllers: [FilesController],
})
export class FilesModule {}

