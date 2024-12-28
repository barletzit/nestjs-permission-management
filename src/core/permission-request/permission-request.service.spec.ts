import { Test, TestingModule } from '@nestjs/testing';
import { PermissionRequestService } from './permission-request.service';

describe('PermissionRequestService', () => {
  let service: PermissionRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PermissionRequestService],
    }).compile();

    service = module.get<PermissionRequestService>(PermissionRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
