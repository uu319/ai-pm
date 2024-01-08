import { Test, TestingModule } from '@nestjs/testing';
import { SymphChanService } from './symph-chan.service';

describe('SymphChanService', () => {
  let service: SymphChanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SymphChanService],
    }).compile();

    service = module.get<SymphChanService>(SymphChanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
