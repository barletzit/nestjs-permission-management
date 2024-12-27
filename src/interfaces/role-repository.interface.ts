import { Role } from 'src/models/role.model';

export interface IRoleRepository {
  save(role: Role): Promise<Role>; // upsert
  findById(id: string): Promise<Role | null>;
  findAll(): Promise<Role[]>;
  delete(id: string): Promise<void>;
}
