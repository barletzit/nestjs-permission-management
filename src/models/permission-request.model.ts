import { PermissionRequestStatusType, PermissionRequestType } from '../types';

export class PermissionRequest {
  constructor(
    public id: string,
    public roleId: string,
    public permission: string,
    public requestType: PermissionRequestType,
    public requestedBy: string,
    public status: PermissionRequestStatusType,
    public createdAt: Date,
    public approvers: string[], // user ids
    public approvals: Map<string, boolean>, // userId -> approved/rejected
    public comments?: string,
  ) {}
}
