import { Global, Module } from '@nestjs/common';
import { AuthModule } from 'src/modules/auth/auth.module';
import { RealtimeGateway } from './realtime.gateway';
import { CacheManagerModule } from '../cache-manager/cache-manager.module';

@Global()
@Module({
	imports: [AuthModule, CacheManagerModule],
	providers: [RealtimeGateway],
	exports: [RealtimeGateway],
})
export class RealtimeModule {}
