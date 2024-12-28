import { Test, TestingModule } from '@nestjs/testing';
import { PermissionRequestController } from './permission-request.controller';

describe('PermissionRequestController', () => {
  let controller: PermissionRequestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PermissionRequestController],
    }).compile();

    controller = module.get<PermissionRequestController>(PermissionRequestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
