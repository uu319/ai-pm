import { Module } from '@nestjs/common';
import { VanDiscordBotController } from './van-discord-bot.controller';
import { VanDiscordBotService } from './van-discord-bot.service';
import { ConfigModule } from '@nestjs/config';
import { vanDiscordBotConfig } from '../common/configs/ai-config.config copy';
import { aiConfig } from '../common/configs/ai-config.config';

@Module({
  imports: [
    ConfigModule.forFeature(vanDiscordBotConfig),
    ConfigModule.forFeature(aiConfig),
  ],
  controllers: [VanDiscordBotController],
  providers: [VanDiscordBotService],
})
export class VanDiscordBotModule {}
