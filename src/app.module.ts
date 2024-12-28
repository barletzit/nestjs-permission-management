import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PermissionModule } from './core/permission/permission.module';
import { CacheModule } from '@nestjs/cache-manager';
import { PermissionRequestModule } from './core/permission-request/permission-request.module';

const TTL_IN_MS = 2 * 60 * 1000;

@Module({
  imports: [
    CacheModule.register({ isGlobal: true, ttl: TTL_IN_MS }),
    PermissionModule,
    PermissionRequestModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
