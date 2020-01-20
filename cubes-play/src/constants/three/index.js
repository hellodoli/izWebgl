export const CAMERA = {
  x: {
    default: 0,
    min: 1,
    max: 20
  },
  y: {
    default: 0,
    min: -20,
    max: 20
  },
  z: {
    default: 10,
    min: 1,
    max: 100
  }
};

export const PLANE = {
  width: 200,
  height: 200,
  xRange: {
    min: -100,
    max: 100
  },
  zRange: {
    min: -100,
    max: 100
  }
};

export const CONTROL = {
  name: {
    camera: "Camera",
    play: "Play"
  },
  type: {
    range: "range",
    button: "button"
  }
};

export const CUBE = {
  x: 10,
  y: 3,
  z: 5
};

export const POS = {
  x: "X",
  y: "Y"
};
