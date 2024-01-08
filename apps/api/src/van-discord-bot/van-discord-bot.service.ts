import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Client, IntentsBitField, Message } from 'discord.js';
import { ConfigType } from '@nestjs/config';
import { vanDiscordBotConfig } from '../common/configs/ai-config.config copy';
import { aiConfig } from '../common/configs/ai-config.config';
import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/chat';

@Injectable()
export class VanDiscordBotService implements OnModuleInit {
  private client: Client;

  constructor(
    @Inject(vanDiscordBotConfig.KEY)
    private readonly vanDefaultDiscordBotConfig: ConfigType<
      typeof vanDiscordBotConfig
    >,
    @Inject(aiConfig.KEY)
    private readonly aiDefaultConfig: ConfigType<typeof aiConfig>
  ) {
    this.client = new Client({
      intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
      ],
    });
  }

  onModuleInit() {
    this.initializeClient();
  }

  private initializeClient() {
    this.client.on('ready', () => {
      console.log(`Logged in as ${this.client.user.tag}!`);
    });

    this.client.on('messageCreate', (message: Message) =>
      this.handleMessage(message)
    );

    this.client.login(this.vanDefaultDiscordBotConfig.discordBotToken);
  }

  private async handleMessage(message: Message) {
    const openAi = new OpenAI({ apiKey: this.aiDefaultConfig.openApiKey });

    if (message.author.bot) return;
    if (message.content.startsWith('!')) return;

    const conversationLog: ChatCompletionMessageParam[] = [
      { role: 'system', content: 'You are a friendly chatbot.' },
    ];

    try {
      await message.channel.sendTyping();
      const prevMessages = await message.channel.messages.fetch({ limit: 15 });
      prevMessages.reverse();

      prevMessages.forEach((msg) => {
        console.log('the messages');
        if (msg.content.startsWith('!')) return;
        if (msg.author.id !== this.client.user.id && message.author.bot) return;
        if (msg.author.id == this.client.user.id) {
          conversationLog.push({
            role: 'assistant',
            content: msg.content,
            name: msg.author.username
              .replace(/\s+/g, '_')
              .replace(/[^\w\s]/gi, ''),
          });
        }

        if (msg.author.id == message.author.id) {
          conversationLog.push({
            role: 'user',
            content: msg.content,
            name: message.author.username
              .replace(/\s+/g, '_')
              .replace(/[^\w\s]/gi, ''),
          });
        }
      });

      const result = await openAi.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: conversationLog,
        // max_tokens: 256, // limit token usage
      });

      message.reply(result.choices[0].message);
    } catch (error) {
      console.log(`ERR: ${error}`);
    }
    // Add more message handling logic here
  }

  private replyToMention(message: Message) {
    message.reply('Hello!');
  }
}
