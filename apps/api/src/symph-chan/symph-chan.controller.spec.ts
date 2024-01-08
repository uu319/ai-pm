import { Test, TestingModule } from '@nestjs/testing';
import { SymphChanController } from './symph-chan.controller';

describe('SymphChanController', () => {
  let controller: SymphChanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SymphChanController],
    }).compile();

    controller = module.get<SymphChanController>(SymphChanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
