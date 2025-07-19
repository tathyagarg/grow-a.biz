export function darken(color: string, amount: number): string {
  const num = parseInt(color.slice(1), 16);
  const r = Math.max((num >> 16) - amount, 0);
  const g = Math.max(((num >> 8) & 0x00FF) - amount, 0);
  const b = Math.max((num & 0x0000FF) - amount, 0);

  const result = `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
  return result;
}

export function mix(color1: string, color2: string, weight: number): string {
  const num1 = parseInt(color1.slice(1), 16);
  const num2 = parseInt(color2.slice(1), 16);

  const r = Math.round(((num1 >> 16) * (1 - weight)) + ((num2 >> 16) * weight));
  const g = Math.round((((num1 >> 8) & 0x00FF) * (1 - weight)) + (((num2 >> 8) & 0x00FF) * weight));
  const b = Math.round(((num1 & 0x0000FF) * (1 - weight)) + ((num2 & 0x0000FF) * weight));

  return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
}
