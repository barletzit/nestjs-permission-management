import { SetMetadata } from '@nestjs/common';
import { Permissions } from 'src/types';

export const PERMISSIONS = 'permissions';

export const RequirePermissions = (...permissions: Permissions[]) =>
  SetMetadata(PERMISSIONS, permissions);
