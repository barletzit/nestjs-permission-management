import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { RoleRepository } from 'src/repositories/role-repository';
import { ROLE_REPOSITORY } from 'src/interfaces/role-repository.interface';

@Module({
  providers: [
    RoleService,
    { provide: ROLE_REPOSITORY, useClass: RoleRepository },
  ],
  controllers: [RoleController],
  exports: [RoleService],
})
export class RoleModule {}
