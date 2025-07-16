export function darken(color: string, amount: number): string {
  const num = parseInt(color.slice(1), 16);
  const r = Math.max((num >> 16) - amount, 0);
  const g = Math.max(((num >> 8) & 0x00FF) - amount, 0);
  const b = Math.max((num & 0x0000FF) - amount, 0);

  const result = `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
  return result;
}
