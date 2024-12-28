import { Module } from '@nestjs/common';
import { AuditLogService } from './audit-log.service';
import { AuditLogController } from './audit-log.controller';
import {
  AUDIT_LOG_REPOSITORY,
  AuditLogRepository,
} from 'src/repositories/audit-log-repository';

@Module({
  providers: [
    AuditLogService,
    { provide: AUDIT_LOG_REPOSITORY, useClass: AuditLogRepository },
  ],
  controllers: [AuditLogController],
  exports: [AuditLogService],
})
export class AuditLogModule {}
