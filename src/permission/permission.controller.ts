import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreateRoleDto } from 'src/dtos/create-role.dto';
import { Role } from 'src/models/role.model';

@Controller('permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post('roles')
  async createRole(@Body() createRoleDto: CreateRoleDto): Promise<Role> {
    return this.permissionService.createRole(createRoleDto);
  }

  @Get('roles/:roleId/permissions')
  async getRolePermissions(@Param('roleId') roleId: string): Promise<string[]> {
    const permissions = await this.permissionService.getRolePermissions(roleId);
    return Array.from(permissions);
  }

  @Get('users/:userId/check/:permission')
  async checkUserPermission(
    @Param('userId') userId: string,
    @Param('permission') permission: string,
  ): Promise<boolean> {
    return this.permissionService.checkUserPermission(userId, permission);
  }

  @Put('roles/:roleId/permissions/:permission')
  async grantPermission(
    @Param('roleId') roleId: string,
    @Param('permission') permission: string,
  ): Promise<Role> {
    return this.permissionService.grantPermissionToRole(roleId, permission);
  }

  @Delete('roles/:roleId/permissions/:permission')
  async revokePermission(
    @Param('roleId') roleId: string,
    @Param('permission') permission: string,
  ): Promise<Role> {
    return this.permissionService.revokePermissionToRole(roleId, permission);
  }
}
