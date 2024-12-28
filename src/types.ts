export enum CacheKeys {
  RolePermissions = 'role_permissions',
}

type FindByKeys = 'id' | 'name';
export type FindByParams = Partial<Record<FindByKeys, string>>;

export enum AuditActionType {
  ROLE_CREATED = 'ROLE_CREATED',
  ROLE_UPDATED = 'ROLE_UPDATED',
  ROLE_DELETED = 'ROLE_DELETED',
  PERMISSION_GRANTED = 'PERMISSION_GRANTED',
  PERMISSION_REVOKED = 'PERMISSION_REVOKED',
  USER_CREATED = 'USER_CREATED',
  USER_ROLE_CHANGED = 'USER_ROLE_CHANGED',
}

export const auditTarget = {
  ROLE: 'ROLE',
  USER: 'USER',
} as const;

export type AuditTargetType = keyof typeof auditTarget;
