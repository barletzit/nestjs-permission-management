import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class ApprovePermissionRequestDto {
  @IsString()
  requestId: string;

  @IsString()
  approverId: string;

  @IsBoolean()
  approved: boolean;

  @IsOptional()
  @IsString()
  comments?: string;
}

type ApproveRequestBody = Omit<
  ApprovePermissionRequestDto,
  'approverId' | 'requestId'
>;

export class ApproveRequestBodyDto implements ApproveRequestBody {
  @IsBoolean()
  approved: boolean;

  @IsOptional()
  @IsString()
  comments?: string;
}
