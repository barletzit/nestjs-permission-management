import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateRoleDto } from '../../dtos/create-role.dto';
import { Role } from '../../models/role.model';
import { RoleService } from './role.service';
import { FindRoleQuery } from 'src/dtos/find-role-query.dto';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  async createRole(@Body() createRoleDto: CreateRoleDto): Promise<Role> {
    return this.roleService.createRole(createRoleDto);
  }

  /**
   * find by role id or role name
   * @param query role?name=admin | role?id=123
   * @returns a Role
   */
  @Get()
  async findRole(@Query() query: FindRoleQuery): Promise<Role | null> {
    return this.roleService.findBy(query);
  }

  @Get()
  findAll() {
    return this.roleService.findAll();
  }

  @Patch(':id')
  updateRole(
    @Param('id') id: string,
    @Body() { name, parentRoleId }: { name: string; parentRoleId: string },
  ) {
    return this.roleService.update({
      roleId: id,
      name,
      parentRoleId,
      isPermissionUpdate: false,
    });
  }

  @Delete(':id')
  async deleteRole(@Param('id') id: string) {
    return this.roleService.delete(id);
  }
}
