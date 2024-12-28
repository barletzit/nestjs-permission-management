import { Injectable } from '@nestjs/common';
import { IPermissionRequestRepository } from '../interfaces/permission-request-repository.interface';
import { PermissionRequest } from '../models/permission-request.model';

@Injectable()
export class PermissionRequestRepository
  implements IPermissionRequestRepository
{
  private static instance: PermissionRequestRepository;
  private requests: Map<string, PermissionRequest> = new Map();

  constructor() {
    if (!PermissionRequestRepository.instance) {
      PermissionRequestRepository.instance = this;
    }

    return PermissionRequestRepository.instance;
  }

  get requestsList() {
    return Array.from(this.requests.values());
  }

  async save(request: PermissionRequest): Promise<PermissionRequest> {
    this.requests.set(request.id, request);
    return request;
  }

  async findById(id: string): Promise<PermissionRequest | null> {
    return this.requests.get(id) || null;
  }

  async findPendingForApprover(
    approverId: string,
  ): Promise<PermissionRequest[]> {
    return this.requestsList.filter((request) => {
      return (
        request.approvers.includes(approverId) &&
        request.status === 'PENDING' &&
        !request.approvals.has(approverId)
      );
    });
  }

  async findPendingByRoleId(roleId: string): Promise<PermissionRequest[]> {
    return this.requestsList.filter(
      (request) => request.status === 'PENDING' && request.roleId === roleId,
    );
  }
}
