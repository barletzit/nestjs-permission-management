import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  IPermissionRequestRepository,
  PERMISSION_REQUEST,
} from '../../interfaces/permission-request-repository.interface';
import { PermissionRequest } from '../../models/permission-request.model';
import { CreatePermissionRequestDto } from '../../dtos/create-permission-request.dto';
import { ApprovePermissionRequestDto } from '../../dtos/approve-permission-request.dto';
import { RoleService } from '../role/role.service';
import { PermissionService } from '../permission/permission.service';
import { AuditActionType } from '../../types';
import { AuditLogService } from '../audit-log/audit-log.service';

@Injectable()
export class PermissionRequestService {
  constructor(
    @Inject(PERMISSION_REQUEST)
    private readonly permissionRequestRepository: IPermissionRequestRepository,
    private readonly roleService: RoleService,
    private readonly permissionService: PermissionService,
    private readonly auditLogService: AuditLogService,
  ) {}

  async createPermissionRequest({
    roleId,
    permission,
    requestType,
    requestedBy,
    approvers,
    comments,
  }: CreatePermissionRequestDto): Promise<PermissionRequest> {
    const role = await this.roleService.findBy({ id: roleId });
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    const request = new PermissionRequest(
      crypto.randomUUID(),
      roleId,
      permission,
      requestType,
      requestedBy,
      'PENDING',
      new Date(),
      approvers,
      new Map(),
      comments,
    );

    return this.permissionRequestRepository.save(request);
  }

  async approvePermissionRequest({
    approverId,
    approved,
    requestId,
  }: ApprovePermissionRequestDto): Promise<PermissionRequest> {
    const request = await this.permissionRequestRepository.findById(requestId);
    if (!request) {
      throw new NotFoundException('Permission request not found');
    }

    if (!request.approvers.includes(approverId)) {
      throw new ForbiddenException('Not authorized to approve this request');
    }

    if (request.status !== 'PENDING') {
      throw new BadRequestException('Request is not pending');
    }

    request.approvals.set(approverId, approved);

    // check if we have all necessary approvals - meaning if other approvers
    // approved or rejected
    const isFullyApproved = this.checkFullyApproved(request);
    const isRejected = this.checkRejected(request);

    if (isFullyApproved) {
      request.status = 'APPROVED';
      if (request.requestType === 'GRANT') {
        await this.permissionService.grantPermissionToRole(
          request.roleId,
          request.permission,
          approverId,
        );
      } else {
        await this.permissionService.revokePermissionToRole(
          request.roleId,
          request.permission,
          approverId,
        );
      }
    } else if (isRejected) {
      request.status = 'REJECTED';
    }

    await this.auditLogService.logAction({
      actionType: AuditActionType.PERMISSION_REQUEST_REVIEWED,
      performedBy: approverId,
      targetId: request.id,
      targetType: 'PERMISSION_REQUEST',
      before: { status: 'PENDING' },
      after: { status: request.status, approved },
      metadata: null,
    });

    return this.permissionRequestRepository.save(request);
  }

  async getPendingPermissionRequests(
    approverId: string,
  ): Promise<PermissionRequest[]> {
    return this.permissionRequestRepository.findPendingForApprover(approverId);
  }

  private checkFullyApproved(request: PermissionRequest): boolean {
    return request.approvers.every(
      (approverId) => request.approvals.get(approverId) === true,
    );
  }

  private checkRejected(request: PermissionRequest): boolean {
    return Array.from(request.approvals.values()).some((approved) => !approved);
  }
}
