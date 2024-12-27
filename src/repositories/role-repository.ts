// in memory repository

import { Injectable } from '@nestjs/common';
import { IRoleRepository } from 'src/interfaces/role-repository.interface';
import { Role } from 'src/models/role.model';

@Injectable()
export class RoleRepository implements IRoleRepository {
  private roles: Map<string, Role> = new Map();

  async save(role: Role): Promise<Role> {
    this.roles.set(role.id, role);
    return role;
  }

  async findById(id: string): Promise<Role | null> {
    return this.roles.get(id) || null;
  }

  async findAll(): Promise<Role[]> {
    return Array.from(this.roles.values());
  }

  async delete(id: string): Promise<void> {
    this.roles.delete(id);
  }
}
