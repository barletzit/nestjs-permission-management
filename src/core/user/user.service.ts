import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../../dtos/create-user.dto';
import { USER_REPOSITORY } from '../../interfaces/user-repository.interface';
import { User } from '../../models/user.model';
import { UserRepository } from '../../repositories/user-repository';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async createUser({ name, roleId }: CreateUserDto) {
    const user = new User(crypto.randomUUID(), name, roleId);
    return this.userRepository.save(user);
  }

  async findById(id: string): Promise<User> {
    return this.userRepository.findById(id);
  }
}
