import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';
import { AuditLogModule } from 'src/core/audit-log/audit-log.module';
import { RoleModule } from '../role/role.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [RoleModule, UserModule, AuditLogModule],
  providers: [PermissionService],
  controllers: [PermissionController],
})
export class PermissionModule {}
