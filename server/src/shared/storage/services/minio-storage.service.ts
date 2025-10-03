import {
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common';
import { StorageService } from '../storage.interface';
import { s3Client } from 'src/shared/config/minio.config';
import {
	DeleteObjectCommand,
	GetObjectCommand,
	PutObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { FileCategories } from 'src/common/enums/file-categories';
import { generateFileKey } from '../utils/generate-file-key';
import { Upload } from '@aws-sdk/lib-storage';
import { Readable } from 'stream';

@Injectable()
export class MinioStorageService implements StorageService {
	private readonly bucketName = 'the-hearth';
	private readonly multipartThreshold = 5 * 1024 * 1024;

	async upload(
		file: Express.Multer.File,
		category: FileCategories
	): Promise<string> {
		const key = generateFileKey(file.originalname, category);

		if (file.size > this.multipartThreshold) {
			const parallelUploads3 = new Upload({
				client: s3Client,
				params: {
					Bucket: this.bucketName,
					Key: key,
					Body: file.buffer,
					ContentType: file.mimetype,
				},
				queueSize: 4,
				partSize: 1024 * 1024 * 5,
				leavePartsOnError: false,
			});

			await parallelUploads3.done();
		} else {
			await s3Client.send(
				new PutObjectCommand({
					Bucket: this.bucketName,
					Key: key,
					Body: file.buffer,
					ContentType: file.mimetype,
				})
			);
		}
		return key;
	}

	async getFileStream(key: string): Promise<Readable> {
		try {
			const command = new GetObjectCommand({
				Bucket: this.bucketName,
				Key: key,
			});

			const response = await s3Client.send(command);
			if (!response.Body) {
				throw new Error('File not found');
			}

			return response.Body as Readable;
		} catch (error) {
			if (error.name === 'NoSuchKey') {
				throw new NotFoundException('File not found');
			}
			throw new InternalServerErrorException(
				'Failed to get file from storage.'
			);
		}
	}

	async getUrl(key: string): Promise<string> {
		return getSignedUrl(
			s3Client,
			new GetObjectCommand({
				Bucket: this.bucketName,
				Key: key,
			}),
			{ expiresIn: 3600 }
		);
	}

	async delete(key: string): Promise<void> {
		await s3Client.send(
			new DeleteObjectCommand({
				Bucket: this.bucketName,
				Key: key,
			})
		);
	}
}
