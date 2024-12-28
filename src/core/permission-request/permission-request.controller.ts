import {
  Controller,
  Post,
  UseGuards,
  Put,
  Get,
  Body,
  Param,
} from '@nestjs/common';
import { PermissionRequestService } from './permission-request.service';
import { AuthGuard } from '../../guards/auth.guard';
import { PermissionGuard } from '../../guards/permission.guard';
import { RequirePermissions } from '../../decorators/required-permissions.decorator';
import { Permissions } from '../../types';
import { CreatePermissionRequestBodyDto } from '../../dtos/create-permission-request.dto';
import { CurrentUserId } from '../../decorators/current-user-id.decorator';
import { PermissionRequest } from '../../models/permission-request.model';
import { ApproveRequestBodyDto } from '../../dtos/approve-permission-request.dto';

@Controller('permission-request')
@UseGuards(AuthGuard, PermissionGuard)
export class PermissionRequestController {
  constructor(
    private readonly permissionRequestService: PermissionRequestService,
  ) {}

  @Post()
  @RequirePermissions(Permissions.RequestPermissionChanges)
  async createPermissionRequest(
    @Body() dto: CreatePermissionRequestBodyDto,
    @CurrentUserId() requestedBy: string,
  ) {
    const { roleId, permission, requestType, approvers, comments } = dto;
    return this.permissionRequestService.createPermissionRequest({
      roleId,
      permission,
      requestType,
      requestedBy,
      approvers,
      comments,
    });
  }

  @Put(':requestId/approve')
  @RequirePermissions(Permissions.ApprovePermissionChanges)
  async approveRequest(
    @Param('requestId') requestId: string,
    @Body() dto: ApproveRequestBodyDto,
    @CurrentUserId() approverId: string,
  ): Promise<PermissionRequest> {
    const { approved, comments } = dto;
    return this.permissionRequestService.approvePermissionRequest({
      approverId,
      approved,
      requestId,
      comments,
    });
  }

  @Get('pending')
  @RequirePermissions(Permissions.ViewPermissionRequests)
  async getPendingRequests(
    @CurrentUserId() userId: string,
  ): Promise<PermissionRequest[]> {
    return this.permissionRequestService.getPendingPermissionRequests(userId);
  }
}
