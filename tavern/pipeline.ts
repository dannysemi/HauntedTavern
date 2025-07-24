import { streamText, type CoreMessage } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

// Pre-processing function
function applyPreProcessing(messages: CoreMessage[]): CoreMessage[] {
  return messages
}

// Post-processing function
function applyPostProcessing(response: ReturnType<typeof streamText>) {
  return response.toDataStreamResponse();
}

// Main exported functio
export async function processPipeline(messages: CoreMessage[]) {
  const openai = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL
  });
  const model = openai(process.env.MODEL_NAME || 'gpt-4-turbo');

  const response = await streamText({
    model,
    messages: applyPreProcessing(messages),
    system: process.env.SYSTEM_MESSAGE || 'Be helpful and concise'
  });

  return applyPostProcessing(response);
}