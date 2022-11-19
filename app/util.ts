export const HSLToRGB = (h: number, s: number, l: number) => {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [255 * f(0), 255 * f(8), 255 * f(4)];
}

function pad(n:number): string {
  if (n < 10 ) {
    return '0' + n;
  }
  return n.toString(10);
}

export const DateToDateStr = (d: Date): string => {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export const IsSameDay = (l: Date, r: Date): boolean => {
  return l.getUTCFullYear() == r.getUTCFullYear()
    && l.getUTCMonth() == r.getUTCMonth()
    && l.getUTCDay() == r.getUTCDay()
}