import { registerAs } from '@nestjs/config';

export default registerAs('notion', () => ({
  notionApiKey: process.env.NOTION_API_KEY,
}));
