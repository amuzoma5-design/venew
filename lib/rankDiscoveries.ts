interface Rankable {
  id: string;
  category: string;
  location: string;
  featured?: boolean;
  date: string;
  [key: string]: any;
}

export function rankDiscoveries<T extends Rankable>(
  events: T[],
  opts: { interests?: string[]; city?: string; viewedCategories?: string[] } = {}
): T[] {
  const { interests = [], city = "", viewedCategories = [] } = opts;

  const scored = events.map((event) => {
    let score = 0;
    if (interests.includes(event.category)) score += 5;
    if (city && event.location?.toLowerCase().includes(city.toLowerCase())) score += 3;
    if (viewedCategories.includes(event.category)) score += 2;
    if (event.featured) score += 1;
    return { ...event, __score: score };
  });

  return scored
    .sort((a, b) => {
      if (b.__score !== a.__score) return b.__score - a.__score;
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    })
       .map(({ __score, ...rest }) => rest as unknown as T);
}