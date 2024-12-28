import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/dtos/create-user.dto';
import { USER_REPOSITORY } from 'src/interfaces/user-repository.interface';
import { User } from 'src/models/user.model';
import { UserRepository } from 'src/repositories/user-repository';

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
}
