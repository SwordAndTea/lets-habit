function pad(n: number): string {
  if (n < 10) {
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
