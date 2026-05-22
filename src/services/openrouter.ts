import axios from 'axios';
import type { ChatMessage } from '@/types/ai';

// All AI calls go through a serverless proxy that holds the OpenRouter key
// server-side — the key is never shipped to the browser.
const PROXY_URL = import.meta.env.VITE_AI_PROXY_URL as string;

interface ChatResponse {
  choices: { message: { content: string } }[];
}

export async function chat(messages: ChatMessage[], temperature = 0.8): Promise<string> {
  const { data } = await axios.post<ChatResponse>(
    PROXY_URL,
    { messages, temperature },
    { headers: { 'Content-Type': 'application/json' } },
  );
  return data.choices[0]?.message?.content ?? '';
}

// Extract first JSON array/object from a model response that may wrap it in prose or code fences.
export function parseJSON<T>(raw: string): T | null {
  let text = raw.trim();
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fence) text = fence[1].trim();
  const start = text.search(/[[{]/);
  if (start === -1) return null;
  const open = text[start];
  const close = open === '[' ? ']' : '}';
  const end = text.lastIndexOf(close);
  if (end === -1 || end < start) return null;
  try {
    return JSON.parse(text.slice(start, end + 1)) as T;
  } catch {
    return null;
  }
}
