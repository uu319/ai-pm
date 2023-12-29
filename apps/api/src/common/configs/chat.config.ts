import { registerAs } from '@nestjs/config';

export default registerAs('chat', () => ({
  pdfChatIntroSystemMessage: process.env.PDF_CHAT_INTRO_SYSTEM_MESSAGE,
  pdfChatReasoningSystemMessage: process.env.PDF_CHAT_REASONING_SYSTEM_MESSAGE,
}));
