import { AuditActionType, AuditTargetType } from 'src/types';

export class CreateLogDto {
  actionType: AuditActionType;
  performedBy: string;
  targetId: string;
  targetType: AuditTargetType;
  before: unknown;
  after: unknown;
  metadata: Record<string, unknown> | null;
}