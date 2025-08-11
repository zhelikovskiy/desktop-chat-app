import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { UserVerificationDto } from 'src/common/dto/user-verification.dto';

@Injectable()
export class RedisService {
	constructor(@Inject('REDIS_CLIENT') private redis: Redis) {}

	private async set<T>(key: string, value: T, ttlSeconds?: number) {
		const data = JSON.stringify(value);
		if (ttlSeconds) {
			await this.redis.set(key, data, 'EX', ttlSeconds);
		} else {
			await this.redis.set(key, data);
		}
	}

	private async get<T>(key: string) {
		const data = await this.redis.get(key);
		if (!data) return null;
		return JSON.parse(data) as T;
	}

	async saveVerification(code: string, data: UserVerificationDto) {
		await this.set(`verify:${code}`, data, 60 * 10);
	}

	async getVerification(code: string): Promise<UserVerificationDto | null> {
		const data: UserVerificationDto | null = await this.get(
			`verify:${code}`
		);

		if (data) {
			await this.del(`verify:${code}`);
			return data;
		} else return null;
	}

	async del(key: string) {
		await this.redis.del(key);
	}
}
