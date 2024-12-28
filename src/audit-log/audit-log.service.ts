import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  AUDIT_LOG_REPOSITORY,
  AuditLogRepository,
} from 'src/repositories/audit-log-repository';
import { Cache } from 'cache-manager';
import { CreateLogDto } from 'src/dtos/create-log.dto';
import { AuditLog } from 'src/models/audit-log.model';

@Injectable()
export class AuditLogService {
  constructor(
    @Inject(AUDIT_LOG_REPOSITORY)
    private readonly auditLogRepository: AuditLogRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async logAction(createLogProps: CreateLogDto): Promise<AuditLog> {
    const {
      actionType,
      targetId,
      targetType,
      performedBy,
      before,
      after,
      metadata,
    } = createLogProps;
    const log = new AuditLog(
      crypto.randomUUID(),
      actionType,
      performedBy,
      targetId,
      targetType,
      { before, after },
      new Date(),
      metadata,
    );

    return this.auditLogRepository.save(log);
  }

  async getHistoryForTarget(targetId: string): Promise<AuditLog[]> {
    const cacheKey = `audit_history_${targetId}`;
    const cached = await this.cacheManager.get<AuditLog[]>(cacheKey);

    if (cached) {
      return cached;
    }

    const logs = await this.auditLogRepository.findByTargetId(targetId);
    await this.cacheManager.set(cacheKey, logs, 120000);
    return logs;
  }

  // version number based on the index of the item in the logs array
  async getRollbackVersion(targetId: string, version: number): Promise<any> {
    const history = await this.getHistoryForTarget(targetId);
    const sortedHistory = history.sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime(),
    );

    if (version >= sortedHistory.length) {
      throw new BadRequestException('Version not available');
    }

    return sortedHistory[version].changes.before;
  }

  async generateComplianceReport(startDate: Date, endDate: Date): Promise<any> {
    const logs = await this.auditLogRepository.findByTimeRange(
      startDate,
      endDate,
    );

    return {
      totalActions: logs.length,
      actionsByType: this.groupByActionType(logs),
      actionsByUser: this.groupByUser(logs),
      timeRange: { startDate, endDate },
    };
  }

  private groupByActionType(logs: AuditLog[]): Record<string, number> {
    return logs.reduce(
      (acc, log) => {
        acc[log.actionType] = (acc[log.actionType] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
  }

  private groupByUser(logs: AuditLog[]): Record<string, number> {
    return logs.reduce(
      (acc, log) => {
        acc[log.performedBy] = (acc[log.performedBy] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
  }
}
