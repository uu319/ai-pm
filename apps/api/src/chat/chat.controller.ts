import { Controller, Get, Query } from '@nestjs/common';
import { ChatService } from './chat.service';
import { AskParamsDto } from './dto/ask-params.dto';
import { ChatConversationService } from './chat.conversation.service';

@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly chatConversationService: ChatConversationService
  ) {}

  @Get('/ask')
  ask(@Query() queryString: AskParamsDto) {
    return this.chatService.ask(queryString.text);
  }

  @Get('/converse')
  converse(@Query() queryString: AskParamsDto) {
    return this.chatConversationService.converse(queryString.text);
  }

  // @Get('/summary')
  // summary() {
  //   return this.chatService.summarizeDocs();
  // }
}
