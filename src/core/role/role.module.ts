import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { RoleRepository } from '../../repositories/role-repository';
import { ROLE_REPOSITORY } from '../../interfaces/role-repository.interface';

@Module({
  providers: [
    RoleService,
    { provide: ROLE_REPOSITORY, useClass: RoleRepository },
  ],
  controllers: [RoleController],
  exports: [RoleService],
})
export class RoleModule {}
