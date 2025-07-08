export type SortDir = 'asc' | 'desc' | null;
export interface SortState {
  key: 'postId' | 'name' | 'email' | null;
  dir: SortDir;
}

export function nextSortDir(current: SortDir): SortDir {
  return current === null ? 'asc' : current === 'asc' ? 'desc' : null;
}

export function sortBy<T>(
  rows: T[],
  { key, dir }: SortState
): T[] {
  if (!key || !dir) return rows;
  return [...rows].sort((a: any, b: any) => {
    const aVal = String(a[key]).toLowerCase();
    const bVal = String(b[key]).toLowerCase();
    if (aVal === bVal) return 0;
    const compare = aVal < bVal ? -1 : 1;
    return dir === 'asc' ? compare : -compare;
  });
}
