// in memory repository
import { Injectable } from '@nestjs/common';
import { IUserRepository } from 'src/interfaces/user-repository.interface';
import { User } from 'src/models/user.model';

@Injectable()
export class UserRepository implements IUserRepository {
  private users: Map<string, User> = new Map();

  async save(user: User): Promise<User> {
    this.users.set(user.id, user);
    return user;
  }

  async findById(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  async findAll(): Promise<User[]> {
    return Array.from(this.users.values());
  }
}
