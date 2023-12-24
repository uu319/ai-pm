import { Test, TestingModule } from '@nestjs/testing';

import { WarmupController } from './warmup.controller';

describe('WarmupController', () => {
  let controller: WarmupController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WarmupController],
    }).compile();

    controller = module.get<WarmupController>(WarmupController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
