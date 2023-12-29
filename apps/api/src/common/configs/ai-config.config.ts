import { registerAs } from '@nestjs/config';
import { AI } from '../constants';

export const aiConfig = registerAs(AI, async () => {
  const config = {
    openApiKey: process.env.OPENAI_API_KEY,
    pineconeApiKey: process.env.PINECONE_API_KEY,
    pineconeEnvironment: process.env.PINECONE_ENVIRONMENT,
  };

  return config;
});
