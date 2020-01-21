import React, { Component } from "react";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { isNumber, randomRange } from "../../helper";

import { PLANE, CONTROL, CUBE, POS } from "../../constants/three";
import Plane from "../../object/Plane";

import Controls from "../Controls";

import "./styled/index.css";

/* Custom default param */
const CAMERA_PLAY = {
  x: {
    label: "Camera X",
    default: 0,
    min: 1,
    max: 20
  },
  y: {
    label: "Camera Y",
    default: 100,
    min: 50,
    max: 200
  },
  z: {
    label: "Camera Z",
    default: 300,
    min: 100,
    max: 600
  }
};

const BUTTON_PLAY = {
  destroy: {
    label: "Destroy",
    color: "danger",
    isDisabled: false
  },
  build: {
    label: "Build",
    color: "primary",
    isDisabled: true
  }
};

const PLANE_PLAY = {
  width: {
    label: "Plane width",
    default: PLANE.width,
    min: 50,
    max: 200
  },
  height: {
    label: "Plane height",
    default: PLANE.height,
    min: 50,
    max: 200
  }
};

class Cubes extends Component {
  constructor() {
    super();
    this.canvasContainer = React.createRef();
    this.state = {
      isDestroying: false,
      /* Default param setting */
      controlItem: [
        /*{
          name: CONTROL.name.camera,
          items: [
            {
              type: CONTROL.type.range,
              param: CAMERA_PLAY.x
            },
            {
              type: CONTROL.type.range,
              param: CAMERA_PLAY.y
            },
            {
              type: CONTROL.type.range,
              param: CAMERA_PLAY.z
            }
          ]
        },*/
        {
          name: CONTROL.name.play,
          items: [
            {
              type: CONTROL.type.button,
              param: BUTTON_PLAY.destroy
            },
            {
              type: CONTROL.type.button,
              param: BUTTON_PLAY.build
            }
          ]
        },
        {
          name: CONTROL.name.plane,
          items: [
            {
              type: CONTROL.type.range,
              param: PLANE_PLAY.width
            },
            {
              type: CONTROL.type.range,
              param: PLANE_PLAY.height
            }
          ]
        }
      ]
    };
  }

  sceneSetup = () => {
    this.container = this.canvasContainer.current;

    const width = this.container.clientWidth;
    const height = window.innerHeight - window.innerWidth * 0.1;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, width / height, 1, 1000);
    window.camera = this.camera;

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(width, height);
    this.container.appendChild(this.renderer.domElement);

    // create controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    //this.controls.update();
  };

  customSceneSetup = () => {
    //this.scene.background = new THREE.Color(0x6c757d);

    this.camera.position.y = CAMERA_PLAY.y.default;
    this.camera.position.z = CAMERA_PLAY.z.default;

    var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    this.scene.add(directionalLight);

    //var axesHelper = new THREE.AxesHelper(50);
    //scene.add(axesHelper);
  };

  createPlane = (w, h) => {
    if (this.plane) {
      this.scene.remove(this.plane.shape);
    }
    this.plane = new Plane(w, h);
    this.plane.shape.rotateX(-Math.PI * 0.5);
    this.scene.add(this.plane.shape);
  };

  startAnimationLoop = () => {
    this.requestID = window.requestAnimationFrame(this.startAnimationLoop);
    this.renderer.render(this.scene, this.camera);
  };

  makeCubeLevel = callback => {
    this.cubeLevel = {};
    this.cubes = {
      x: {
        front: [],
        back: []
      },
      y: {
        front: [],
        back: []
      }
    };

    // level X
    const maxCubeLevelXRound = parseInt(this.plane.height / (CUBE.z * 2));
    this.cubeLevel.x = [];
    for (let i = 0; i < maxCubeLevelXRound; i++) {
      this.cubeLevel.x[i] = { front: false, back: false };
    }

    // level Z
    const maxCubeLevelZRound = parseInt(this.plane.width / (CUBE.z * 2));
    this.cubeLevel.y = [];
    for (let i = 0; i < maxCubeLevelZRound; i++) {
      this.cubeLevel.y[i] = { front: false, back: false };
    }

    callback(this.cubeLevel);
  };

  createCubeRandom = (isFront, level, pos) => {
    level = parseInt(level);
    if (level >= this.cubeLevel.x.length || level < 0 || isNaN(level)) return;

    const posType = isFront ? "front" : "back";
    if (this.cubeLevel.x[level][posType] === true) return;
    if (pos !== POS.x && pos !== POS.y) return;

    let indexCube = -1; // cube index
    let d = 0;
    let cubeXPrev = 0; // sum of cube X (with pos = POS.x), sum of cube Z (with pos = POS.z)
    let cubeX = 0;
    let cubeY = 0;
    let cubeZ = 0;
    let limit = 0;

    const xRange = this.plane.xRange;
    const zRange = this.plane.zRange;

    // define cubeX, cubeY, cubeZ
    if (pos === POS.x) {
      this.cubeLevel.x[level][posType] = true;
      cubeZ = CUBE.z;
      cubeY = CUBE.y;
      limit = this.plane.width - 2 * level * cubeZ;
      //cubeX = Math.round(randomRange(1, (limit / 2)));
      this.cubes.x[posType][level] = [];
    } else {
      this.cubeLevel.y[level][posType] = true;
      cubeX = CUBE.z;
      cubeY = CUBE.y;
      limit = this.plane.height - 2 * (level + 1) * cubeX;
      //cubeZ = Math.round(randomRange(1, (limit / 2)));
      this.cubes.y[posType][level] = [];
    }

    while (d < limit) {
      indexCube += 1;
      if (pos === POS.x) {
        cubeX = Math.round(randomRange(1, limit / 2));
        d += cubeX;
      } else {
        cubeZ = Math.round(randomRange(1, limit / 2));
        d += cubeZ;
      }

      // cut last cube
      if (d > limit) {
        if (pos === POS.x) cubeX -= d - limit;
        else cubeZ -= d - limit;
        d = limit;
      }

      // create Cube
      const geometry = new THREE.BoxGeometry(cubeX, cubeY, cubeZ);
      const material = new THREE.MeshPhongMaterial({
        side: THREE.DoubleSide,
        shininess: 100,
        color: Math.random() * 0xffffff,
        wireframe: false
      });
      const cube = new THREE.Mesh(geometry, material);

      // setting position
      const cubePosY = cubeY / 2 + level * cubeY;
      let cubePosX;
      let cubePosZ;
      if (pos === POS.x) {
        cubePosX = xRange.min + cubeZ * level + cubeXPrev + cubeX / 2;
        cubePosZ = isFront
          ? zRange.max - cubeZ / 2 - level * cubeZ
          : zRange.min + cubeZ / 2 + level * cubeZ;

        cubeXPrev += cubeX;
        this.cubes.x[posType][level].push(cube);
      } else {
        // front is left, back is right
        cubePosX = isFront
          ? xRange.max - cubeX / 2 - level * cubeX
          : xRange.min + cubeX / 2 + level * cubeX;
        cubePosZ = zRange.min + cubeX * (level + 1) + cubeXPrev + cubeZ / 2;

        cubeXPrev += cubeZ;
        this.cubes.y[posType][level].push(cube);
      }

      cube.position.x = cubePosX;
      cube.position.y = cubePosY;
      cube.position.z = cubePosZ;

      this.scene.add(cube);
    }
  };

  build = () => {
    const cubes = this.cubes;
    if (cubes === undefined || Object.values(cubes).length === 0) {
      this.makeCubeLevel(cubeLevel => {
        console.log("cubeLevel: ", cubeLevel);
        for (let y = 0; y < cubeLevel.y.length; y++) {
          this.createCubeRandom(false, y, POS.y);
          this.createCubeRandom(true, y, POS.y);
        }

        for (let x = 0; x < cubeLevel.x.length; x++) {
          this.createCubeRandom(false, x, POS.x);
          this.createCubeRandom(true, x, POS.x);
        }
      });
    }
  };

  resetCubes = () => {
    this.setState({ isDestroying: false });
    this.cubeLevel = {};
    this.cubes = {};
  };

  doSetTimeout = (i, cube, time = 100) => {
    window.setTimeout(() => {
      this.scene.remove(cube);
    }, time * i);
  };

  destroyCubes = (time, callback) => {
    if (!this.state.isDestroying) {
      if (Object.values(this.cubes).length > 0) {
        console.log("Before Destroy");
        console.log("this.cubes: ", this.cubes);

        this.setState({ isDestroying: true });

        const cubeXBack = this.cubes.x.back;
        let max = 0;
        let sectionTime = 0;
        // find section time
        for (let i = 0; i < cubeXBack.length; i++) {
          if (cubeXBack[i].length > max) {
            max = cubeXBack[i].length;
          }
        }

        sectionTime = max * time;

        // destroy X
        ["front", "back"].forEach(posType => {
          this.cubes.x[posType].forEach((cubeRow, i) => {
            cubeRow.forEach((cube, j) => this.doSetTimeout(j, cube, time));
          });
        });

        // after X is destroyed, destroy Y
        const cubesYBack = this.cubes.y.back;
        let lastRow = false;
        setTimeout(() => {
          ["front", "back"].forEach(posType => {
            const cubeRow = this.cubes.y[posType];
            for (let i = 0; i < cubeRow.length; i++) {
              // check last row
              if (posType === "back" && i === cubesYBack.length - 1) {
                lastRow = true;
                // check last cube
                if (cubesYBack[i].length === 0) {
                  this.resetCubes();
                  if (typeof callback === "function") {
                    callback();
                  }
                }
              }
              for (let j = 0; j < cubeRow[i].length; j++) {
                this.doSetTimeout(j, cubeRow[i][j], time);
                // check last cube
                if (lastRow && j === cubeRow[i].length - 1) {
                  this.resetCubes();
                  if (typeof callback === "function") {
                    callback();
                  }
                }
              }
            }
          });
        }, sectionTime);
      }
    } else {
      console.log("...destroying, please wait");
    }
  };

  setCameraPosition = (type, value) => {
    switch (type) {
      case CAMERA_PLAY.x.label:
        this.camera.position.x = value;
        break;
      case CAMERA_PLAY.y.label:
        this.camera.position.y = value;
        break;
      case CAMERA_PLAY.z.label:
        this.camera.position.z = value;
        break;
      default:
        break;
    }
  };

  // Controls function
  changeInputControl = (i, j, e) => {
    let value = e.target.value;

    if (!isNumber(value)) {
      alert("Input must be number");
      return;
    }

    let controlItemClone = this.state.controlItem.slice();
    const control = controlItemClone[i].items[j].param;
    value = Number(value);
    if (value > control.max) value = control.max;
    if (value < control.min) value = control.min;
    control.default = value;
    this.setState({
      controlItem: controlItemClone
    });

    // Setting live
    if (controlItemClone[i].name === CONTROL.name.camera) {
      this.setCameraPosition(control.label, value);
    }

    if (controlItemClone[i].name === CONTROL.name.plane) {
      if (control.label === PLANE_PLAY.width.label) {
        const h = this.plane.height;
        this.createPlane(value, h);
      }

      if (control.label === PLANE_PLAY.height.label) {
        const w = this.plane.width;
        this.createPlane(w, value);
      }
    }
  };

  onClickControl = (i, j) => {
    let controlItemClone = this.state.controlItem.slice();
    const control = controlItemClone[i].items[j].param;

    if (controlItemClone[i].name === CONTROL.name.play) {
      if (control.label === BUTTON_PLAY.destroy.label) {
        this.destroyCubes(500, () => {
          control.isDisabled = true;

          // find button Build and turn off disabled
          for (let z = 0; z < controlItemClone[i].items.length; z++) {
            if (
              controlItemClone[i].items[z].param.label ===
              BUTTON_PLAY.build.label
            ) {
              controlItemClone[i].items[z].param.isDisabled = false;
            }
          }
          this.setState({
            controlItem: controlItemClone
          });
        });
      } else if (control.label === BUTTON_PLAY.build.label) {
        this.build();
      }
    }
  };

  componentDidMount() {
    this.sceneSetup();
    this.customSceneSetup();
    this.createPlane(PLANE.width, PLANE.height);
    this.build();
    this.startAnimationLoop();
  }

  render() {
    const isCanBuild =
      this.cubes === undefined || Object.values(this.cubes).length === 0
        ? true
        : false;
    return (
      <div className="live-show" ref={this.canvasContainer}>
        <Controls
          controlItem={this.state.controlItem}
          changeInputControl={this.changeInputControl}
          onClickControl={this.onClickControl}
        />
      </div>
    );
  }
}

export default Cubes;
