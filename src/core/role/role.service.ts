import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateRoleDto } from '../../dtos/create-role.dto';
import { UpdateRoleDto } from '../../dtos/update-role.dto';
import {
  IRoleRepository,
  ROLE_REPOSITORY,
} from '../../interfaces/role-repository.interface';
import { Role } from '../../models/role.model';
import { FindByParams } from '../../types';

@Injectable()
export class RoleService {
  constructor(
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepository: IRoleRepository,
  ) {}

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

  async findBy(params: FindByParams): Promise<Role | null> {
    const { id, name } = params;

    if (!id && !name) {
      throw new BadRequestException('You must provide id OR name');
    }
    if (id && name) {
      throw new BadRequestException('Provide either id OR name, not both');
    }

    if (id) {
      return this.roleRepository.findById(id);
    }

    if (name) {
      return this.roleRepository.findByName(name);
    }

    return null;
  }

  async findAll(): Promise<Role[]> {
    return this.roleRepository.findAll();
  }

  async update(roleUpdateProps: UpdateRoleDto): Promise<Role> {
    return this.roleRepository.update(roleUpdateProps);
  }

  async delete(id: string): Promise<void> {
    return this.roleRepository.delete(id);
  }
}
