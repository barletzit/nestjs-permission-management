import { Controller, Get, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { Role } from '../../models/role.model';
import { AuthGuard } from '../../guards/auth.guard';
import { PermissionGuard } from '../../guards/permission.guard';
import { RequirePermissions } from '../../decorators/required-permissions.decorator';
import { Permissions } from '../../types';
import { CurrentUserId } from '../../decorators/current-user-id.decorator';

@Controller('permissions')
@UseGuards(AuthGuard, PermissionGuard)
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

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
  @RequirePermissions(Permissions.ManagePermissions)
  async grantPermission(
    @Param('roleId') roleId: string,
    @Param('permission') permission: string,
    @CurrentUserId() userId: string,
  ): Promise<Role> {
    return this.permissionService.grantPermissionToRole(
      roleId,
      permission,
      userId,
    );
  }

  @Delete('roles/:roleId/permissions/:permission')
  @RequirePermissions(Permissions.ManagePermissions)
  async revokePermission(
    @Param('roleId') roleId: string,
    @Param('permission') permission: string,
    @CurrentUserId() userId: string,
  ): Promise<Role> {
    return this.permissionService.revokePermissionToRole(
      roleId,
      permission,
      userId,
    );
  }
}
