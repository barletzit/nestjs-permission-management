import { IsOptional, IsString } from 'class-validator';
import { PermissionRequestType } from '../types';

export class CreatePermissionRequestDto {
  @IsString()
  roleId: string;

  @IsString()
  permission: string;

  requestType: PermissionRequestType;

  @IsString()
  requestedBy: string;

  approvers: string[];

  @IsOptional()
  @IsString()
  comments?: string;
}

type CreatePermissionRequestBody = Omit<
  CreatePermissionRequestDto,
  'requestedBy'
>;

export class CreatePermissionRequestBodyDto
  implements CreatePermissionRequestBody
{
  @IsString()
  roleId: string;

  @IsString()
  permission: string;

  requestType: PermissionRequestType;

  approvers: string[];

  @IsOptional()
  @IsString()
  comments?: string;
}
