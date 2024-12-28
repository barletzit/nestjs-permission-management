import { Injectable } from '@nestjs/common';
import { IAuditRepository } from 'src/interfaces/audit-log-repository.interface';
import { AuditLog } from 'src/models/audit-log.model';
import { AuditActionType } from '../types';

@Injectable()
export class AuditLogRepository implements IAuditRepository {
  private static instance: AuditLogRepository;
  private logs: AuditLog[];

  constructor() {
    if (!AuditLogRepository.instance) {
      AuditLogRepository.instance = this;
    }

    return AuditLogRepository.instance;
  }

  async save(log: AuditLog): Promise<AuditLog> {
    this.logs.push(log);
    return log;
  }

  async findByTargetId(targetId: string): Promise<AuditLog[]> {
    return this.logs.filter((log) => log.targetId === targetId);
  }

  async findByActionType(actionType: AuditActionType): Promise<AuditLog[]> {
    return this.logs.filter((log) => log.actionType === actionType);
  }

  async findByTimeRange(start: Date, end: Date): Promise<AuditLog[]> {
    return this.logs.filter(
      (log) => log.timestamp >= start && log.timestamp <= end,
    );
  }

  async findByPerformedBy(userId: string): Promise<AuditLog[]> {
    return this.logs.filter((log) => log.performedBy === userId);
  }
}
