import { S3Client } from '@aws-sdk/client-s3';

export const s3Client = new S3Client({
	endpoint: process.env.MINIO_ENDPOINT ?? 'http://localhost:9000',
	region: 'us-east-1',
	credentials: {
		accessKeyId: 'admin',
		secretAccessKey: 'password123',
	},
	forcePathStyle: true,
});
