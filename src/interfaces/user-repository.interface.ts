import { User } from '../models/user.model';

export const USER_REPOSITORY = 'USER_REPOSITORY';

export interface IUserRepository {
  save(user: User): Promise<User>;
  findById(id: string): Promise<User | null>;
  findAll(): Promise<User[]>;
}
