import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { AuditLogService } from '../audit-log/audit-log.service';
import { Role } from '../../models/role.model';
import { AuditActionType, CacheKeys } from '../../types';
import { RoleService } from '../role/role.service';
import { UserService } from '../user/user.service';

@Injectable()
export class PermissionService {
  constructor(
    private readonly roleService: RoleService,
    private readonly userService: UserService,
    private readonly auditLogService: AuditLogService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  private getCacheKey(roleId: string) {
    return `${CacheKeys.RolePermissions}_${roleId}`;
  }

  async getRolePermissions(roleId: string): Promise<Set<string>> {
    const cacheKey = this.getCacheKey(roleId);
    const cachedPermissions =
      await this.cacheManager.get<Set<string>>(cacheKey);

    if (cachedPermissions) {
      console.log('found cached role permissions');
      return cachedPermissions;
    }

    const permissions = await this.calculateRolePermissions(roleId);
    console.log('saving role permissions to cache...');
    await this.cacheManager.set(cacheKey, permissions, 3_600_000);

    return permissions;
  }

  private async calculateRolePermissions(roleId: string): Promise<Set<string>> {
    const role = await this.roleService.findBy({ id: roleId });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    const permissions = new Set(role.permissions);

    if (role.parentRoleId) {
      const parentPermissions = await this.calculateRolePermissions(
        role.parentRoleId,
      );
      parentPermissions.forEach((permission) => permissions.add(permission));
    }

    return permissions;
  }

  async checkUserPermission(
    userId: string,
    permission: string,
  ): Promise<boolean> {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const userRolePermissions = await this.getRolePermissions(user.roleId);
    return userRolePermissions.has(permission);
  }

  async grantPermissionToRole(
    roleId: string,
    permission: string,
    userId: string,
  ): Promise<Role> {
    const role = await this.roleService.findBy({ id: roleId });
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    const beforePermissions = new Set(role.permissions);
    role.permissions.add(permission);

    await this.auditLogService.logAction({
      actionType: AuditActionType.PERMISSION_GRANTED,
      performedBy: userId,
      targetId: roleId,
      targetType: 'ROLE',
      before: { permissions: Array.from(beforePermissions) },
      after: { permissions: Array.from(role.permissions) },
      metadata: null,
    });

    const cacheKey = this.getCacheKey(roleId);
    console.log('deleting cached role permissions...');
    this.cacheManager.del(cacheKey);
    return this.roleService.createRole({
      name: role.name,
      parentRoleId: role.parentRoleId,
      permissions: Array.from(role.permissions),
    });
  }

  async revokePermissionToRole(
    roleId: string,
    permission: string,
    userId: string,
  ): Promise<Role> {
    const role = await this.roleService.findBy({ id: roleId });
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    const beforePermissions = new Set(role.permissions);
    role.permissions.delete(permission);

    await this.auditLogService.logAction({
      actionType: AuditActionType.PERMISSION_REVOKED,
      performedBy: userId,
      targetId: roleId,
      targetType: 'ROLE',
      before: { permissions: Array.from(beforePermissions) },
      after: { permissions: Array.from(role.permissions) },
      metadata: null,
    });

    const cacheKey = this.getCacheKey(roleId);
    console.log('deleting cached role permissions...');
    this.cacheManager.del(cacheKey);
    return this.roleService.createRole({
      name: role.name,
      parentRoleId: role.parentRoleId,
      permissions: Array.from(role.permissions),
    });
  }
}
