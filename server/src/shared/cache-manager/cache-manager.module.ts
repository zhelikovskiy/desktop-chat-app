import { Module } from '@nestjs/common';
import { CacheManagerService } from './cache-manager.service';
import { redisStore } from 'cache-manager-redis-store';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
	imports: [
		CacheModule.registerAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => {
				const store = await redisStore({
					host: configService.get<string>('REDIS_HOST'),
					port: configService.get<number>('REDIS_PORT'),
				});
				return {
					store: store,
				};
			},
			inject: [ConfigService],
		}),
	],
	providers: [CacheManagerService],
	exports: [CacheManagerService],
})
export class CacheManagerModule {}
