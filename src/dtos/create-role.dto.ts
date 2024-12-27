import { IsArray, IsString } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  name: string;

  parentRoleId: string | null;

  @IsArray()
  @IsString({ each: true })
  permissions: string[]; // convert to set in the service
}
