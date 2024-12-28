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
  PERMISSION_REQUEST_REVIEWED = 'PERMISSION_REQUEST_REVIEWED',
}

export const permissionRequestStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED',
} as const;

export type PermissionRequestStatusType = keyof typeof permissionRequestStatus;

export const permissionRequest = {
  GRANT: 'GRANT',
  REVOKE: 'REVOKE',
} as const;

export type PermissionRequestType = keyof typeof permissionRequest;

export const auditTarget = {
  ROLE: 'ROLE',
  USER: 'USER',
  PERMISSION_REQUEST: 'PERMISSION_REQUEST',
} as const;

export type AuditTargetType = keyof typeof auditTarget;

export enum Permissions {
  ManagePermissions = 'manage_permissions',
  RequestPermissionChanges = 'request_permission_changes',
  ApprovePermissionChanges = 'approve_permission_changes',
  ViewPermissionRequests = 'view_permission_requests',
}
