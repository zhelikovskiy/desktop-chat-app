import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class CacheManagerService {
	constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

	async set<T>(key: string, value: T, ttlSeconds?: number) {
		if (ttlSeconds) {
			await this.cacheManager.set(key, value, ttlSeconds);
		} else {
			await this.cacheManager.set(key, value);
		}
	}

	async get<T>(key: string) {
		const data = await this.cacheManager.get<T>(key);
		return data || null;
	}

	async del(key: string) {
		await this.cacheManager.del(key);
	}
}
