import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class CacheManagerService {
	constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

	async addSocket(userId: string, socketId: string) {
		const key = `sockets:${userId}`;
		const current: string[] = (await this.get<string[]>(key)) || [];
		if (!current.includes(socketId)) {
			current.push(socketId);
			await this.set<string[]>(key, current);
		}
	}

	async removeSocket(userId: string, socketId: string) {
		const key = `sockets:${userId}`;
		const current: string[] = (await this.get<string[]>(key)) || [];
		const filtered = current.filter((id) => id !== socketId);

		if (filtered.length > 0) {
			await this.set<string[]>(key, filtered);
		} else {
			await this.del(key);
		}
	}

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
