// in memory repository

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateRoleDto } from '../dtos/update-role.dto';
import { IRoleRepository } from '../interfaces/role-repository.interface';
import { Role } from '../models/role.model';

@Injectable()
export class RoleRepository implements IRoleRepository {
  private static instance: RoleRepository;
  private roles: Map<string, Role> = new Map();

  constructor() {
    if (!RoleRepository.instance) {
      RoleRepository.instance = this;
    }

    return RoleRepository.instance;
  }

  private async validateRole(
    role: Role,
    isPermissionUpdate: boolean,
  ): Promise<void> {
    if (!isPermissionUpdate) {
      const existingRole = await this.findByName(role.name);
      if (existingRole)
        throw new BadRequestException('Role name already exists');
    }

    if (role.parentRoleId) {
      const parentRole = await this.findById(role.parentRoleId);
      if (!parentRole) {
        throw new NotFoundException(
          `Parent role with id ${role.parentRoleId} not found`,
        );
      }

      if (role.parentRoleId === role.id) {
        throw new BadRequestException('Role cannot be its own parent');
      }
    }
  }

  async save(role: Role, isPermissionUpdate: boolean): Promise<Role> {
    await this.validateRole(role, isPermissionUpdate);
    this.roles.set(role.id, role);
    return role;
  }

  async update({
    roleId,
    name,
    parentRoleId,
    isPermissionUpdate,
  }: UpdateRoleDto): Promise<Role> {
    const role = await this.findById(roleId);
    if (!role) throw new NotFoundException('Role not found');

    const newRoleName = name ?? role.name;
    const newRoleParentId = parentRoleId ?? role.parentRoleId;
    const updatedRole = new Role(
      roleId,
      newRoleName,
      newRoleParentId,
      role.permissions,
    );

    await this.validateRole(updatedRole, isPermissionUpdate);

    this.roles.set(roleId, updatedRole);
    return updatedRole;
  }

  async findById(id: string): Promise<Role | null> {
    return this.roles.get(id) || null;
  }

  async findByName(name: string): Promise<Role | null> {
    const roles = await this.findAll();
    const existingRole = roles.find((role) => role.name === name);
    return existingRole;
  }

  async findAll(): Promise<Role[]> {
    return Array.from(this.roles.values());
  }

  async delete(id: string): Promise<void> {
    this.roles.delete(id);
  }
}
