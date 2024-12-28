import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { USER_REPOSITORY } from 'src/interfaces/user-repository.interface';
import { UserRepository } from 'src/repositories/user-repository';

@Module({
  providers: [
    UserService,
    { provide: USER_REPOSITORY, useClass: UserRepository },
  ],
  controllers: [UserController],
})
export class UserModule {}
