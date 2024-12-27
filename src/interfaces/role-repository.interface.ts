import { Role } from 'src/models/role.model';

export const ROLE_REPOSITORY = 'ROLE_REPOSITORY';

export interface IRoleRepository {
  save(role: Role, isPermissionUpdate: boolean): Promise<Role>;
  update(
    roleId: string,
    roleName: string,
    parentRoleId: string | null,
    isPermissionUpdate: boolean,
  ): Promise<Role>;
  findById(id: string): Promise<Role | null>;
  findByName(name: string): Promise<Role | null>;
  findAll(): Promise<Role[]>;
  delete(id: string): Promise<void>;
}
