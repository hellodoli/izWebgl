function randomRange (from, to) {
  if (to > from) {
    var init = Math.random() * (to - from);
    return (from + init);
  }
}