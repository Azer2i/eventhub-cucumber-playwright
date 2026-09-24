export type EventCategory = 'Conference' | 'Concert' | 'Sports' | 'Workshop' | 'Festival';

export interface EventFormData {
  title: string;
  description: string;
  category: EventCategory;
  city: string;
  venue: string;
  date: string;
  price: number;
  seats: number;
}

const CATEGORIES: EventCategory[] = ['Conference', 'Concert', 'Sports', 'Workshop', 'Festival'];
const CITIES = ['Bangalore', 'Mumbai', 'Hyderabad', 'Delhi', 'Chennai'];

const TITLE_TOPICS = [
  'Jazz Night',
  'Startup Networking Meetup',
  'Photography Workshop',
  'Food Festival',
  'Tech Summit',
  'Yoga Retreat',
  'Board Game Cafe Night',
  'Investor Pitch Night',
  'Indie Film Screening',
  'Street Art Walk',
  'Live Comedy Show',
  'Craft Beer Tasting',
];
const TITLE_PLACES = [
  'the Old City',
  'Riverside Park',
  'the Innovation Hub',
  'the Downtown Loft',
  'the Community Center',
  'the Arts District',
];
const TITLE_ADJECTIVES = ['Spring', 'Summer', 'Midnight', 'Urban', 'Golden Hour', 'Weekend', 'Annual'];

const DESCRIPTION_SENTENCES = [
  'Join us for an evening filled with live performances, good food, and great company.',
  'This hands-on session is designed for beginners and enthusiasts alike.',
  'Network with industry professionals and share ideas over refreshments.',
  'Expect engaging talks, interactive demos, and plenty of time to connect.',
  'A relaxed atmosphere with activities suited for all skill levels.',
  'Doors open early, so arrive on time to grab a good spot.',
  'Local vendors and artists will be on site throughout the event.',
  'Bring your friends and family for a memorable day out.',
];

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Combines a realistic title template with a short unique suffix so titles stay searchable and collision-free. */
export function randomEventTitle(): string {
  const topic = pickRandom(TITLE_TOPICS);
  const suffix = Date.now().toString(36).slice(-6).toUpperCase();
  const templates = [`${pickRandom(TITLE_ADJECTIVES)} ${topic}`, `${topic} at ${pickRandom(TITLE_PLACES)}`, topic];
  return `${pickRandom(templates)} #${suffix}`;
}

/** Combines 1-3 realistic sentences instead of lorem ipsum filler. */
export function randomEventDescription(): string {
  const count = 1 + Math.floor(Math.random() * 3);
  return shuffle(DESCRIPTION_SENTENCES).slice(0, count).join(' ');
}

export function randomCategory(): EventCategory {
  return pickRandom(CATEGORIES);
}

export function randomCity(): string {
  return pickRandom(CITIES);
}

/** Formats a random future date/time as "YYYY-MM-DDTHH:mm" for the datetime-local input. */
function randomFutureDate(): string {
  const daysAhead = 10 + Math.floor(Math.random() * 300);
  const hour = 9 + Math.floor(Math.random() * 10);
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  date.setHours(hour, 0, 0, 0);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:00`;
}

/** Generates a full, realistic event data object for the Admin Manage Events form. */
export function generateEventData(overrides: Partial<EventFormData> = {}): EventFormData {
  const city = overrides.city ?? randomCity();
  const venue = overrides.venue ?? `${pickRandom(TITLE_PLACES)}, ${city}`;

  return {
    title: randomEventTitle(),
    description: randomEventDescription(),
    category: randomCategory(),
    city,
    venue,
    date: randomFutureDate(),
    price: Math.floor(10 + Math.random() * 490),
    seats: Math.floor(20 + Math.random() * 480),
    ...overrides,
  };
}
