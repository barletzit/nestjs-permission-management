export enum CacheKeys {
  RolePermissions = 'role_permissions',
}

type FindByKeys = 'id' | 'name';
export type FindByParams = Partial<Record<FindByKeys, string>>;
