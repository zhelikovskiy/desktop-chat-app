import { FileCategories } from 'src/common/enums/file-categories';
import { Readable } from 'stream';

export const STORAGE_SERVICE = Symbol('STORAGE_SERVICE');

export interface StorageService {
	upload(
		file: Express.Multer.File,
		category: FileCategories
	): Promise<string>;
	getFileStream(key: string): Promise<Readable>;
	delete(key: string): Promise<void>;
	getUrl(key: string): Promise<string>;
}
