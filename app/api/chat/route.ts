import { type CoreMessage } from 'ai';
import { processPipeline } from '@root/tavern/pipeline';

export async function POST(req: Request) {
  const { messages }: { messages: CoreMessage[] } = await req.json();
  return processPipeline(messages);
}