import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';
import { ROLE_REPOSITORY } from 'src/interfaces/role-repository.interface';
import { USER_REPOSITORY } from 'src/interfaces/user-repository.interface';
import { RoleRepository } from 'src/repositories/role-repository';
import { UserRepository } from 'src/repositories/user-repository';

const TTL_IN_MS = 2 * 60 * 1000;

@Module({
  imports: [CacheModule.register({ isGlobal: true, ttl: TTL_IN_MS })],
  providers: [
    PermissionService,
    { provide: ROLE_REPOSITORY, useClass: RoleRepository },
    { provide: USER_REPOSITORY, useClass: UserRepository },
  ],
  controllers: [PermissionController],
})
export class PermissionModule {}
