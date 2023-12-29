import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { aiConfig } from '../common/configs/ai-config.config';
import { ConfigModule } from '@nestjs/config';
import chatConfig from '../common/configs/chat.config';
import { ChatConversationService } from './chat.conversation.service';
import { VectorDatabaseModule } from '../vector-database/vector-database.module';

@Module({
  imports: [
    ConfigModule.forFeature(aiConfig),
    ConfigModule.forFeature(chatConfig),
    VectorDatabaseModule,
  ],
  providers: [ChatService, ChatConversationService],
  controllers: [ChatController],
  exports: [ChatService, ChatConversationService],
})
export class ChatModule {}
