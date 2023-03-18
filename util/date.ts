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

function twoDigitNum(n: number) {
  if (n < 0 && n > -10) {
    return '-0' + Math.abs(n)
  } else if (n > 0 && n < 10) {
    return '0' + n
  }
  return n.toString()
}

function getRFC3339Timezone(d: Date) {
  let zone = 0 - d.getTimezoneOffset() / 60
  if (zone > 0) {
    return '+' + twoDigitNum(zone) + ':00'
  } else {
    return twoDigitNum(zone) + ':00'
  }
}

export const DateToRFC3339FormatString = (d: Date): string => {
  return d.getFullYear() + '-' +
    twoDigitNum(d.getMonth() + 1) + '-' +
    twoDigitNum(d.getDate()) + 'T' +
    twoDigitNum(d.getHours()) + ':' +
    twoDigitNum(d.getMinutes()) + ':' +
    twoDigitNum(d.getSeconds()) +
    getRFC3339Timezone(d)
};

export function CalculatedStartDay() {
  let calculatedStartDay = new Date()
  calculatedStartDay.setDate(calculatedStartDay.getDate() - 365)
  if (calculatedStartDay.getDay() != 0) {
    calculatedStartDay.setDate(calculatedStartDay.getDate() - calculatedStartDay.getDay())
  }
  return calculatedStartDay
}
