import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';
import { ROLE_REPOSITORY } from 'src/interfaces/role-repository.interface';
import { USER_REPOSITORY } from 'src/interfaces/user-repository.interface';
import { RoleRepository } from 'src/repositories/role-repository';
import { UserRepository } from 'src/repositories/user-repository';
import { AuditLogModule } from 'src/core/audit-log/audit-log.module';

@Module({
  imports: [AuditLogModule],
  providers: [
    PermissionService,
    { provide: ROLE_REPOSITORY, useClass: RoleRepository },
    { provide: USER_REPOSITORY, useClass: UserRepository },
  ],
  controllers: [PermissionController],
})
export class PermissionModule {}
