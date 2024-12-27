import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CreateRoleDto } from 'src/dtos/create-role.dto';
import {
  IRoleRepository,
  ROLE_REPOSITORY,
} from 'src/interfaces/role-repository.interface';
import {
  IUserRepository,
  USER_REPOSITORY,
} from 'src/interfaces/user-repository.interface';
import { Role } from 'src/models/role.model';
import { CacheKeys } from 'src/types';

@Injectable()
export class PermissionService {
  constructor(
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepository: IRoleRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  private getCacheKey(roleId: string) {
    return `${CacheKeys.RolePermissions}_${roleId}`;
  }

  async createRole({
    name,
    parentRoleId,
    permissions,
  }: CreateRoleDto): Promise<Role> {
    const role = new Role(
      crypto.randomUUID(),
      name,
      parentRoleId,
      new Set(permissions),
    );

    return this.roleRepository.save(role, false);
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
    const role = await this.roleRepository.findById(roleId);

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
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const userRolePermissions = await this.getRolePermissions(user.roleId);
    return userRolePermissions.has(permission);
  }

  async grantPermissionToRole(
    roleId: string,
    permission: string,
  ): Promise<Role> {
    const role = await this.roleRepository.findById(roleId);
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    role.permissions.add(permission);
    const cacheKey = this.getCacheKey(roleId);
    console.log('deleting cached role permissions...');
    this.cacheManager.del(cacheKey);
    return this.roleRepository.save(role, true);
  }

  async revokePermissionToRole(
    roleId: string,
    permission: string,
  ): Promise<Role> {
    const role = await this.roleRepository.findById(roleId);
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    role.permissions.delete(permission);
    const cacheKey = this.getCacheKey(roleId);
    console.log('deleting cached role permissions...');
    this.cacheManager.del(cacheKey);
    return this.roleRepository.save(role, true);
  }
}