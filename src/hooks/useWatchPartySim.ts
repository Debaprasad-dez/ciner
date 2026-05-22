import { useEffect, useRef, useState } from 'react';

// Local simulation of a realtime watch party. No server: fake participants
// chat on a timer, polls appear periodically. Swap for socket.io later.

export interface Participant {
  id: string;
  name: string;
  color: string;
  you?: boolean;
}

export interface ChatMsg {
  id: number;
  authorId: string;
  text: string;
  reactions: string[];
}

export interface Poll {
  id: number;
  question: string;
  options: string[];
  votes: number[];
}

const PEOPLE: Participant[] = [
  { id: 'you', name: 'You', color: '#E8624A', you: true },
  { id: 'mara', name: 'Mara', color: '#7B5EA7' },
  { id: 'devin', name: 'Devin', color: '#4ECDC4' },
  { id: 'iris', name: 'Iris', color: '#C9954C' },
];

const AMBIENT = [
  'this cinematography is unreal',
  'wait rewind that shot',
  'the score here 🔥',
  'called it — total foreshadow',
  'who else has chills',
  'best frame of the year honestly',
];

const POLL_BANK: Omit<Poll, 'id' | 'votes'>[] = [
  { question: 'Is this scene foreshadowing?', options: ['Yes', 'No', 'Maybe'] },
  { question: 'Trust this character?', options: ['Never', 'Somewhat', 'Fully'] },
  { question: 'Is the twist coming?', options: ['Already here', 'Soon', 'No twist'] },
];

export function useWatchPartySim(enabled: boolean) {
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [poll, setPoll] = useState<Poll | null>(null);
  const msgId = useRef(0);
  const pollId = useRef(0);

  useEffect(() => {
    if (!enabled) return;
    const chatTimer = setInterval(() => {
      const others = PEOPLE.filter((p) => !p.you);
      const author = others[Math.floor(Math.random() * others.length)];
      const text = AMBIENT[Math.floor(Math.random() * AMBIENT.length)];
      setMessages((m) => [...m.slice(-40), { id: ++msgId.current, authorId: author.id, text, reactions: [] }]);
    }, 5000);

    const pollTimer = setInterval(() => {
      const base = POLL_BANK[Math.floor(Math.random() * POLL_BANK.length)];
      setPoll({ ...base, id: ++pollId.current, votes: base.options.map(() => Math.floor(Math.random() * 5)) });
    }, 18000);

    return () => {
      clearInterval(chatTimer);
      clearInterval(pollTimer);
    };
  }, [enabled]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    setMessages((m) => [...m.slice(-40), { id: ++msgId.current, authorId: 'you', text, reactions: [] }]);
  };

  const react = (id: number, emoji: string) =>
    setMessages((m) => m.map((msg) => (msg.id === id ? { ...msg, reactions: [...msg.reactions, emoji] } : msg)));

  const votePoll = (optionIndex: number) =>
    setPoll((p) => (p ? { ...p, votes: p.votes.map((v, i) => (i === optionIndex ? v + 1 : v)) } : p));

  return { participants: PEOPLE, messages, poll, sendMessage, react, votePoll };
}
