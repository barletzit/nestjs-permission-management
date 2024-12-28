import { Controller, Get, Param, Query } from '@nestjs/common';
import { AuditLogService } from './audit-log.service';
import { AuditLog } from 'src/models/audit-log.model';

@Controller('audit')
export class AuditLogController {
  constructor(private readonly auditLogService: AuditLogService) {}

  @Get('history/:targetId')
  async getHistory(@Param('targetId') targetId: string): Promise<AuditLog[]> {
    return this.auditLogService.getHistoryForTarget(targetId);
  }

  @Get('rollback/:targetId/:version')
  async getRollbackVersion(
    @Param('targetId') targetId: string,
    @Param('version') version: number,
  ): Promise<any> {
    return this.auditLogService.getRollbackVersion(targetId, version);
  }

  @Get('compliance-report')
  async getComplianceReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<any> {
    return this.auditLogService.generateComplianceReport(
      new Date(startDate),
      new Date(endDate),
    );
  }
}
