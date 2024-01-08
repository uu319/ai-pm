import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import OpenAI from 'openai';
import { aiConfig } from '../common/configs/ai-config.config';

@Injectable()
export class SymphChanService {
  constructor(
    @Inject(aiConfig.KEY)
    private readonly aiDefaultConfig: ConfigType<typeof aiConfig>
  ) {}

  async query() {
    const openai = new OpenAI({
      apiKey: this.aiDefaultConfig.openApiKey,
    });

    const functions = {
      getAllocations: async (obj: { userId: string }) => {
        const allocations = {
          van: 'van allocation',
          rachel: 'rachel alocation',
        };

        return allocations[obj.userId];
      },
      updateAllocations: async (obj: { userId: string }) => {
        const allocations = {
          van: 'van allocation',
          rachel: 'rachel alocation',
        };

        return allocations[obj.userId];
      },
      fetchInformation: async (obj: { userId: string }) => {
        const allocations = {
          van: 'van allocation',
          rachel: 'rachel alocation',
        };

        return allocations[obj.userId];
      },
      subtract: (obj: { num1: number; num2: number }) => {
        const difference = obj.num1 - obj.num2;
        console.log('Difference is', difference);
      },
    };

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      temperature: 0,
      messages: [
        {
          role: 'system',
          content: 'You are a an AI assistant',
        },
        {
          role: 'user',
          content: "What is van's allocation?",
        },
      ],
      functions: [
        {
          name: 'getAllocations',
          description:
            'Gets project allocations for the specific user from SymphOS.',
          parameters: {
            type: 'object',
            properties: {
              userId: {
                type: 'string',
              },
            },
          },
        },
        {
          name: 'subtract',
          description: 'Subtracts two numbers',
          parameters: {
            type: 'object',
            properties: {
              num1: {
                type: 'number',
              },
              num2: {
                type: 'number',
              },
            },
          },
        },
      ],
    });

    const function_call = response.choices[0].message.function_call;

    if (function_call) {
      const name = function_call.name;
      const args = JSON.parse(function_call.arguments);
      const fn = functions[name];
      return fn(args);
    }
  }
}
