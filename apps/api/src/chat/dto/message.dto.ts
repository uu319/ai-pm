import { ChatCompletionMessage } from 'openai/resources/chat';

export type Message = {
  id: string;
  createdAt?: Date;
  content: string;
  role: 'system' | 'user' | 'assistant' | 'function';
  /**
   * If the message has a role of `function`, the `name` field is the name of the function.
   * Otherwise, the name field should not be set.
   */
  name?: string;
  /**
   * If the assistant role makes a function call, the `function_call` field
   * contains the function call name and arguments. Otherwise, the field should
   * not be set.
   */
  function_call?: string | ChatCompletionMessage.FunctionCall;
};
