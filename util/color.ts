import tinycolor from "@ctrl/tinycolor";


const NEWTON_ITERATIONS = 4;
const NEWTON_MIN_SLOPE = 0.001;
const SUBDIVISION_PRECISION = 0.0000001;
const SUBDIVISION_MAX_ITERATIONS = 10;

function A(aA1: number, aA2: number) {
  return 1.0 - 3.0 * aA2 + 3.0 * aA1;
}

function B(aA1: number, aA2: number) {
  return 3.0 * aA2 - 6.0 * aA1;
}

function C(aA1: number) {
  return 3.0 * aA1;
}

function calcBezier(aT: number, aA1: number, aA2: number) {
  return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT;
}

function getSlope(aT: number, aA1: number, aA2: number) {
  return 3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1);
}

function binarySubdivide(aX: number, aA: number, aB: number, mX1: number, mX2: number) {
  let currentX, currentT, i = 0;
  do {
    currentT = aA + (aB - aA) / 2.0;
    currentX = calcBezier(currentT, mX1, mX2) - aX;
    if (currentX > 0.0) {
      aB = currentT;
    } else {
      aA = currentT;
    }
  } while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS);
  return currentT;
}

function newtonIterate(aX: number, aGuessT: number, mX1: number, mX2: number) {
  for (let i = 0; i < NEWTON_ITERATIONS; ++i) {
    let currentSlope = getSlope(aGuessT, mX1, mX2);
    if (currentSlope === 0.0) {
      return aGuessT;
    }
    let currentX = calcBezier(aGuessT, mX1, mX2) - aX;
    aGuessT -= currentX / currentSlope;
  }
  return aGuessT;
}


function BezierEasing(mX1: number, mY1: number, mX2: number, mY2: number) {
  let kSplineTableSize = 11;
  let kSampleStepSize = 1.0 / (kSplineTableSize - 1.0);
  let float32ArraySupported = typeof Float32Array === 'function';

  if (!(0 <= mX1 && mX1 <= 1 && 0 <= mX2 && mX2 <= 1)) {
    throw new Error('bezier x values must be in [0, 1] range');
  }

  // Precompute samples table
  let sampleValues = float32ArraySupported ? new Float32Array(kSplineTableSize) : new Array(kSplineTableSize);
  if (mX1 !== mY1 || mX2 !== mY2) {
    for (let i = 0; i < kSplineTableSize; ++i) {
      sampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
    }
  }

  function getTForX(aX: number) {
    let intervalStart = 0.0;
    let currentSample = 1;
    let lastSample = kSplineTableSize - 1;

    for (; currentSample !== lastSample && sampleValues[currentSample] <= aX; ++currentSample) {
      intervalStart += kSampleStepSize;
    }
    --currentSample;

    // Interpolate to provide an initial guess for t
    let dist = (aX - sampleValues[currentSample]) / (sampleValues[currentSample + 1] - sampleValues[currentSample]);
    let guessForT = intervalStart + dist * kSampleStepSize;

    let initialSlope = getSlope(guessForT, mX1, mX2);
    if (initialSlope >= NEWTON_MIN_SLOPE) {
      return newtonIterate(aX, guessForT, mX1, mX2);
    } else if (initialSlope === 0.0) {
      return guessForT;
    } else {
      return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize, mX1, mX2);
    }
  }

  return function (x: number) {
    if (mX1 === mY1 && mX2 === mY2) {
      return x; // linear
    }
    // Because JavaScript number are imprecise, we should guarantee the extremes are right.
    if (x === 0) {
      return 0;
    }
    if (x === 1) {
      return 1;
    }
    return calcBezier(getTForX(x), mY1, mY2);
  };
}

let colorEasing = BezierEasing(0.26, 0.09, 0.37, 0.18)

function mix(color1: any, color2: any, amount: number) {
  amount = (amount === 0) ? 0 : (amount || 50);

  let rgb1 = tinycolor(color1).toRgb();
  let rgb2 = tinycolor(color2).toRgb();

  let p = amount / 100;

  let rgba = {
    r: ((rgb2.r - rgb1.r) * p) + rgb1.r,
    g: ((rgb2.g - rgb1.g) * p) + rgb1.g,
    b: ((rgb2.b - rgb1.b) * p) + rgb1.b,
    a: ((rgb2.a - rgb1.a) * p) + rgb1.a
  };

  return tinycolor(rgba);
}

function genColorPaletteByIndex(color: any, index: number) {
  let warmDark = 0.5;     // warm color darken radio
  let warmRotate = -26;  // warm color rotate degree
  let coldDark = 0.55;     // cold color darken radio
  let coldRotate = 10;   // cold color rotate degree
  let getShadeColor = function (c: any) {
    let shadeColor = tinycolor(c);
    // warm and cold color will darken in different radio, and rotate in different degree
    // warmer color
    if (shadeColor.toRgb().r > shadeColor.toRgb().b) {
      return shadeColor.darken(shadeColor.toHsl().l * warmDark * 100).spin(warmRotate).toHexString();
    }
    // colder color
    return shadeColor.darken(shadeColor.toHsl().l * coldDark * 100).spin(coldRotate).toHexString();
  }
  let primaryEasing = colorEasing(0.6);
  let currentEasing = colorEasing(index * 0.1);
  // return light colors after tint
  if (index <= 6) {
    return mix(
      '#ffffff',
      color,
      currentEasing * 100 / primaryEasing
    ).toHexString();
  }
  return mix(
    getShadeColor(color),
    color,
    (1 - (currentEasing - primaryEasing) / (1 - primaryEasing)) * 100
  ).toHexString();
}

export function GenColorPalette(color: any) {
  let result = []
  for (let i = 1; i < 11; i++) {
    result.push(genColorPaletteByIndex(color, i))
  }
  return result
}
