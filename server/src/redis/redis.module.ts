import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import Redis from 'ioredis';
import { redisConstants } from './constants';

@Module({
	providers: [
		{
			provide: 'REDIS_CLIENT',
			useFactory: () => {
				return new Redis({
					host: redisConstants.host,
					port: redisConstants.port,
				});
			},
		},
		RedisService,
	],
	exports: [RedisService],
})
export class RedisModule {}
