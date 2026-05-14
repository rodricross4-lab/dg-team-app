export type Entity = { id: string | number };

export function createEntity<T extends Entity>(items: T[], item: T): T[] {
  return [...items, item];
}

export function updateEntity<T extends Entity>(items: T[], id: T['id'], patch: Partial<T>): T[] {
  return items.map((item) => (item.id === id ? { ...item, ...patch } : item));
}

export function deleteEntity<T extends Entity>(items: T[], id: T['id']): T[] {
  return items.filter((item) => item.id !== id);
}

export function findEntity<T extends Entity>(items: T[], id: T['id']): T | undefined {
  return items.find((item) => item.id === id);
}
