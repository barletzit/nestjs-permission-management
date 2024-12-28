import { AuditLog } from 'src/models/audit-log.model';
import { AuditActionType } from 'src/types';

export interface IAuditRepository {
  save(log: AuditLog): Promise<AuditLog>;
  findByTargetId(targetId: string): Promise<AuditLog[]>;
  findByActionType(actionType: AuditActionType): Promise<AuditLog[]>;
  findByTimeRange(start: Date, end: Date): Promise<AuditLog[]>;
  findByPerformedBy(userId: string): Promise<AuditLog[]>;
}
