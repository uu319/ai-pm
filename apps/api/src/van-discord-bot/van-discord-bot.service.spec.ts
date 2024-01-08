import { Test, TestingModule } from '@nestjs/testing';
import { VanDiscordBotService } from './van-discord-bot.service';

describe('VanDiscordBotService', () => {
  let service: VanDiscordBotService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VanDiscordBotService],
    }).compile();

    service = module.get<VanDiscordBotService>(VanDiscordBotService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
