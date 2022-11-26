import tinycolor from "@ctrl/tinycolor";

interface HSVColor {
  h: number
  s: number
  v: number
}

function getHue(hsvColor: HSVColor, i: number, isLight: boolean) {
  let hueStep = 2
  let hue = 0
  if (hsvColor.h >= 60 && hsvColor.h <= 240) {
    hue = isLight ? hsvColor.h - hueStep * i : hsvColor.h + hueStep * i
  } else {
    hue = isLight ? hsvColor.h + hueStep * i : hsvColor.h - hueStep * i
  }
  return hue
}

function getSaturation(hsvColor: HSVColor, i: number, isLight: boolean) {
  let saturation = 0
  if (isLight) {
    saturation = Math.round(hsvColor.s * 100) - 16 * i
  } else if (i == 4) {
    saturation = Math.round(hsvColor.s * 100) + 16
  } else {
    saturation = Math.round(hsvColor.s * 100) + 5 * i
  }
  return saturation
}


function getValue(hsvColor: HSVColor, i: number, isLight: boolean) {
  let value = 0
  if (isLight) {
    value =  Math.round(hsvColor.v * 100) + 5 * i
  } else {
    value = Math.round(hsvColor.v * 100) - 15 * i
  }
  return value
}

export const GenGradientColor = (baseColor: any, lightColorCount: number, totalCount: number) => {
  let hsvColor = tinycolor(baseColor).toHsv()
  let result = []
  for (let i = 0; i < totalCount; i++) {
    let isLight = i <= 6
    let j = isLight ? 5 + 1 - i : i - 5 - 1
    result.push(tinycolor({
      h: getHue(hsvColor, j, isLight),
      s: getSaturation(hsvColor, j, isLight),
      v: getValue(hsvColor, j, isLight),
    }).toRgb())
  }

  return result
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