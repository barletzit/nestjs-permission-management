import { PermissionRequest } from '../models/permission-request.model';

export const PERMISSION_REQUEST = 'PERMISSION_REQUEST';

export interface IPermissionRequestRepository {
  save(request: PermissionRequest): Promise<PermissionRequest>;
  findById(id: string): Promise<PermissionRequest | null>;
  findPendingForApprover(approverId: string): Promise<PermissionRequest[]>;
  findPendingByRoleId(roleId: string): Promise<PermissionRequest[]>;
}
