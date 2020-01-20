export function randomRange(from, to) {
  if (to > from) {
    var init = Math.random() * (to - from);
    return from + init;
  }
}

export function isEmptyString(input) {
  if (typeof input === "string" && input.trim() === "") {
    return true;
  }
  return false;
}
/* 
  - input can be string (ex: '123', '1.5') or number (ex: 123, 1.5)
*/
export function isNumber(input) {
  if (isEmptyString(input)) return false;
  var num = Number(input);
  if (!isNaN(num)) {
    return true;
  }
  return false;
}
