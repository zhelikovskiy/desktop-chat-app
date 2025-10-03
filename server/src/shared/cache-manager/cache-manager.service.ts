import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class CacheManagerService {
	constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

	async set<T>(key: string, value: T, ttlSeconds?: number) {
		const data = JSON.stringify(value);
		if (ttlSeconds) {
			await this.cacheManager.set(key, data, ttlSeconds);
		} else {
			await this.cacheManager.set(key, data);
		}
	}

	async get<T>(key: string) {
		const data = await this.cacheManager.get(key);
		if (!data) return null;
		return JSON.parse(data as string) as T;
	}

	async del(key: string) {
		await this.cacheManager.del(key);
	}
}
