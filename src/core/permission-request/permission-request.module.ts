import { Module } from '@nestjs/common';
import { PermissionRequestService } from './permission-request.service';
import { PermissionRequestController } from './permission-request.controller';
import { PERMISSION_REQUEST } from '../../interfaces/permission-request-repository.interface';
import { PermissionRequestRepository } from '../../repositories/permission-request.repository';
import { RoleModule } from '../role/role.module';
import { PermissionModule } from '../permission/permission.module';
import { AuditLogModule } from '../audit-log/audit-log.module';

@Module({
  imports: [RoleModule, PermissionModule, AuditLogModule],
  providers: [
    PermissionRequestService,
    { provide: PERMISSION_REQUEST, useClass: PermissionRequestRepository },
  ],
  controllers: [PermissionRequestController],
})
export class PermissionRequestModule {}
