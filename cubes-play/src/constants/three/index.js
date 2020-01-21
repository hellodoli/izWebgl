export const CAMERA = {
  x: {
    label: "Camera X",
    default: 0,
    min: 1,
    max: 20
  },
  y: {
    label: "Camera Y",
    default: 0,
    min: -20,
    max: 20
  },
  z: {
    label: "Camera Z",
    default: 10,
    min: 1,
    max: 100
  }
};

export const PLANE = {
  width: 50,
  height: 50
};

export const CONTROL = {
  name: {
    camera: "Camera",
    plane: "Plane",
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
