import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PermissionModule } from './core/permission/permission.module';
import { CacheModule } from '@nestjs/cache-manager';

const TTL_IN_MS = 2 * 60 * 1000;

@Module({
  imports: [
    CacheModule.register({ isGlobal: true, ttl: TTL_IN_MS }),
    PermissionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
