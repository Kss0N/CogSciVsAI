


interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}


interface AgentResponse {
  response: string;
  tool_calls?: Array<{ name: string; args: Record<string, unknown> }>;
}


export type { Message, AgentResponse };