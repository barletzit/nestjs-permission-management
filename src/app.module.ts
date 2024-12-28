import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PermissionModule } from './core/permission/permission.module';
import { UserModule } from './core/user/user.module';
import { RoleModule } from './core/role/role.module';
import { AuditLogModule } from './core/audit-log/audit-log.module';
import { CacheModule } from '@nestjs/cache-manager';

const TTL_IN_MS = 2 * 60 * 1000;

@Module({
  imports: [
    CacheModule.register({ isGlobal: true, ttl: TTL_IN_MS }),
    PermissionModule,
    UserModule,
    RoleModule,
    AuditLogModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
