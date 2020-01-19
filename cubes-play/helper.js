function randomRange (from, to) {
  if (to > from) {
    var init = Math.random() * (to - from);
    return (from + init);
  }
}

/* 
  - input can be string (ex: '123', '1.5') or number (ex: 123, 1.5)
*/
function isNumber (input) {
  var num = Number(input);
  if (!isNaN(num)) {
    return true;
  }
  return false;
}