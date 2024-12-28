import { IsBoolean, IsString } from 'class-validator';

export class UpdateRoleDto {
  @IsString()
  roleId: string;

  @IsString()
  name: string | undefined;

  parentRoleId: string | null;

  @IsBoolean()
  isPermissionUpdate: boolean;
}
