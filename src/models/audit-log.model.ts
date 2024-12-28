import { AuditActionType, AuditTargetType } from 'src/types';

export class AuditLog {
  constructor(
    public id: string,
    public actionType: AuditActionType,
    public performedBy: string, // userId
    public targetId: string, // the target type id
    public targetType: AuditTargetType,
    public changes: { before: unknown; after: unknown },
    public timestamp: Date,
    public metadata: Record<string, unknown> | null,
  ) {}
}
