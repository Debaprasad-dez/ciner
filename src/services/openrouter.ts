import axios from 'axios';
import type { ChatMessage } from '@/types/ai';

const BASE = import.meta.env.VITE_OPENROUTER_BASE_URL as string;
const KEY = import.meta.env.VITE_OPENROUTER_API_KEY as string;
const MODEL = import.meta.env.VITE_OPENROUTER_MODEL as string;

const client = axios.create({
  baseURL: BASE,
  headers: {
    Authorization: `Bearer ${KEY}`,
    'Content-Type': 'application/json',
    'HTTP-Referer': 'http://localhost:5173',
    'X-Title': 'CineAI',
  },
});

interface ChatResponse {
  choices: { message: { content: string } }[];
}

export async function chat(messages: ChatMessage[], temperature = 0.8): Promise<string> {
  const { data } = await client.post<ChatResponse>('/chat/completions', {
    model: MODEL,
    messages,
    temperature,
  });
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
