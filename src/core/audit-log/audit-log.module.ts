import { Module } from '@nestjs/common';
import { AuditLogService } from './audit-log.service';
import { AuditLogController } from './audit-log.controller';
import { AuditLogRepository } from '../../repositories/audit-log-repository';
import { AUDIT_LOG_REPOSITORY } from 'src/interfaces/audit-log-repository.interface';

@Module({
  providers: [
    AuditLogService,
    { provide: AUDIT_LOG_REPOSITORY, useClass: AuditLogRepository },
  ],
  controllers: [AuditLogController],
  exports: [AuditLogService],
})
export class AuditLogModule {}
