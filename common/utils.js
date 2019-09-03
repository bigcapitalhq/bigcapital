
export function roundTo(num, to = 2) {
  return +(Math.round(num + "e+" + to)  + "e-" + to);
}