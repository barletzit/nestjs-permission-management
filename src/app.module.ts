import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PermissionModule } from './permission/permission.module';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { AuditLogModule } from './audit-log/audit-log.module';
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
