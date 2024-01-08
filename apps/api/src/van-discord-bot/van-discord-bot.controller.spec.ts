import { Test, TestingModule } from '@nestjs/testing';
import { VanDiscordBotController } from './van-discord-bot.controller';

describe('VanDiscordBotController', () => {
  let controller: VanDiscordBotController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VanDiscordBotController],
    }).compile();

    controller = module.get<VanDiscordBotController>(VanDiscordBotController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
