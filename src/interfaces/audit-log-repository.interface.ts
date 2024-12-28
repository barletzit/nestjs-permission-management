import { AuditLog } from 'src/models/audit-log.model';
import { AuditActionType } from '../types';

export const AUDIT_LOG_REPOSITORY = 'AUDIT_LOG_REPOSITORY';
export interface IAuditRepository {
  save(log: AuditLog): Promise<AuditLog>;
  findByTargetId(targetId: string): Promise<AuditLog[]>;
  findByActionType(actionType: AuditActionType): Promise<AuditLog[]>;
  findByTimeRange(start: Date, end: Date): Promise<AuditLog[]>;
  findByPerformedBy(userId: string): Promise<AuditLog[]>;
}
