import { registerAs } from '@nestjs/config';
import { VAN_DISCORD_BOT } from '../constants';

export const vanDiscordBotConfig = registerAs(VAN_DISCORD_BOT, async () => {
  const config = {
    discordBotToken: process.env.DISCORD_BOT_TOKEN,
    discordClientId: process.env.DISORD_CLIENT_ID,
    discordGuildId: process.env.DISCORD_GUILD_ID,
  };

  return config;
});
