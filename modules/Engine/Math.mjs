// https://www.youtube.com/watch?v=mr5xkf6zSzk
function getRangeMap(value, inStart, inEnd, outStart, outEnd, fn) {
  let out = value - inStart; // Puts in [0, inEnd - inStart]
  out /= (inEnd - inStart);  // Puts in [0, 1]
  out = fn(out); // in [0, 1]
  out *= (outEnd - outStart); // Puts in [0, outRange]
  return out + outStart; // Puts in [outStart, outEnd]
}

function smoothStart(exp) {
  return function (value) {
    // TODO: use * instead of pow
    return Math.pow(value, exp);
  }
}

function smoothStop(exp) {
  return function (value) {
    // TODO: use * instead of pow
    return 1 - Math.pow((1 - value), exp);
  }
}

export { getRangeMap, smoothStart, smoothStop }
