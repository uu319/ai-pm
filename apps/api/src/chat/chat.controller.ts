import { Controller, Get, Query } from '@nestjs/common';
import { ChatService } from './chat.service';
import { AskParamsDto } from './dto/ask-params.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('/ask')
  query(@Query() queryString: AskParamsDto) {
    return this.chatService.ask(queryString.text);
  }
}
