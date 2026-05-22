export interface TimeMood {
  slot: string;
  title: string;
  subtitle: string;
  accent: string; // hex
}

export function getTimeMood(hours = new Date().getHours()): TimeMood {
  if (hours < 5)
    return {
      slot: 'midnight',
      title: 'Midnight Cinema',
      subtitle: 'Surreal, avant-garde, dreamlike',
      accent: '#7B5EA7',
    };
  if (hours < 10)
    return {
      slot: 'morning',
      title: 'Morning Clarity',
      subtitle: 'Light, inspiring, beautiful',
      accent: '#4ECDC4',
    };
  if (hours < 17)
    return {
      slot: 'afternoon',
      title: 'Afternoon Exploration',
      subtitle: 'Varied, discovery-focused',
      accent: '#C9954C',
    };
  if (hours < 20)
    return {
      slot: 'evening',
      title: 'Evening Drama',
      subtitle: 'Emotional, character-driven',
      accent: '#E8624A',
    };
  return {
    slot: 'late',
    title: 'Late Night',
    subtitle: 'Mind-bending, noir, intense',
    accent: '#8B2635',
  };
}
