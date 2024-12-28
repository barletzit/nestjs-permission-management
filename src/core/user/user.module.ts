import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { USER_REPOSITORY } from '../../interfaces/user-repository.interface';
import { UserRepository } from '../../repositories/user-repository';

@Module({
  providers: [
    UserService,
    { provide: USER_REPOSITORY, useClass: UserRepository },
  ],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
