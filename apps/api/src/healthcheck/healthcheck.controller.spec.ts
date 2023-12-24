import { TerminusModule } from '@nestjs/terminus';
import { Test, TestingModule } from '@nestjs/testing';

import { HealthcheckController } from './healthcheck.controller';

describe('HealthcheckController', () => {
  let controller: HealthcheckController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthcheckController],
      imports: [TerminusModule],
    }).compile();

    controller = module.get<HealthcheckController>(
      HealthcheckController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
