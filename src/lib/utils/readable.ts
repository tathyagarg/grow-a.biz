export default function convert_to_readable(num: number, precision: number = 1): string {
  if (num > 1e7) {
    return (num / 1e7).toFixed(precision) + ' Cr';
  } else if (num > 1e5) {
    return (num / 1e5).toFixed(precision) + ' L';
  } else if (num > 1e3) {
    return (num / 1e3).toFixed(precision) + ' K';
  }
  return num.toString();
}
