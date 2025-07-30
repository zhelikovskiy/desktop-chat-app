import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
	constructor(@Inject('REDIS_CLIENT') private redis: Redis) {}

	async set<T>(key: string, value: T, ttlSeconds?: number) {
		const data = JSON.stringify(value);
		if (ttlSeconds) {
			await this.redis.set(key, data, 'EX', ttlSeconds);
		} else {
			await this.redis.set(key, data);
		}
	}

	async get<T>(key: string) {
		const data = await this.redis.get(key);
		if (!data) return null;
		return JSON.parse(data) as T;
	}

	async del(key: string) {
		await this.redis.del(key);
	}
}
