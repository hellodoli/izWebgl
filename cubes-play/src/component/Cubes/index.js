import React, { Component } from "react";
import { WindowSizeContext } from "../../context";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { isNumber, randomRange } from "../../helper";

import { PLANE, CONTROL, CUBE, POS } from "../../constants/three";
import Plane from "../../object/Plane";

import Controls from "../Controls";

import "./styled/index.css";

class Cubes extends Component {
  /* Custom default param */
  static PLANE_PLAY = {
    width: {
      label: "Plane width",
      min: 50,
      max: 200,
      step: 2
    },
    height: {
      label: "Plane height",
      min: 50,
      max: 200,
      step: 2
    }
  };

  static BUTTON_PLAY = {
    destroy: {
      label: "Destroy",
      color: "danger"
    },
    build: {
      label: "Build",
      color: "primary"
    }
  };

  static CAMERA_PLAY = {
    x: {
      label: "Camera X",
      min: 1,
      max: 20
    },
    y: {
      label: "Camera Y",
      min: 50,
      max: 200
    },
    z: {
      label: "Camera Z",
      min: 100,
      max: 600
    }
  };

  constructor() {
    super();
    this.canvasContainer = React.createRef();
    this.state = {
      isDirty: false,
      isDestroying: false,
      controlItem: [
        /*{
        name: CONTROL.name.camera,
        items: [
          {
            type: CONTROL.type.range,
            param: { ...CAMERA_PLAY.x, default: 0 }
          },
          {
            type: CONTROL.type.range,
            param: { ...CAMERA_PLAY.y, default: 100 }
          },
          {
            type: CONTROL.type.range,
            param: { ...CAMERA_PLAY.z, default: 300 }
          }
        ]
      },*/
        {
          name: CONTROL.name.play,
          items: [
            {
              type: CONTROL.type.button,
              param: { ...Cubes.BUTTON_PLAY.destroy, isDisabled: true }
            },
            {
              type: CONTROL.type.button,
              param: { ...Cubes.BUTTON_PLAY.build, isDisabled: false }
            }
          ]
        },
        {
          name: CONTROL.name.plane,
          items: [
            {
              type: CONTROL.type.range,
              param: { ...Cubes.PLANE_PLAY.width, default: PLANE.width }
            },
            {
              type: CONTROL.type.range,
              param: { ...Cubes.PLANE_PLAY.height, default: PLANE.height }
            }
          ]
        }
      ]
    };
  }

  sceneSetup = () => {
    this.container = this.canvasContainer.current;

    const width = this.container.clientWidth;
    const height = this.context.height;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, width / height, 1, 1000);
    window.camera = this.camera;

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(width, height);
    this.container.appendChild(this.renderer.domElement);

    // create controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.update();
  };

  customSceneSetup = () => {
    //this.scene.background = new THREE.Color(0x6c757d);

    this.camera.position.y = 50;
    this.camera.position.z = 100;

    var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    this.scene.add(directionalLight);

    /*var axesHelper = new THREE.AxesHelper(50);
    this.scene.add(axesHelper);*/
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

        this.resetButtonPlay(false, true);
      });
    }
  };

  /* function call after destroy cubes */
  resetCubes = () => {
    this.cubeLevel = {};
    this.cubes = {};
    this.setState({ isDestroying: false });
    this.resetButtonPlay(true, false);
  };

  resetControlItem = () => {
    this.setState({
      controlItem: [
        /*{
          name: CONTROL.name.camera,
          items: [
            {
              type: CONTROL.type.range,
              param: { ...CAMERA_PLAY.x, default: 0 }
            },
            {
              type: CONTROL.type.range,
              param: { ...CAMERA_PLAY.y, default: 100 }
            },
            {
              type: CONTROL.type.range,
              param: { ...CAMERA_PLAY.z, default: 300 }
            }
          ]
        },*/
        {
          name: CONTROL.name.play,
          items: [
            {
              type: CONTROL.type.button,
              param: { ...Cubes.BUTTON_PLAY.destroy, isDisabled: true }
            },
            {
              type: CONTROL.type.button,
              param: { ...Cubes.BUTTON_PLAY.build, isDisabled: false }
            }
          ]
        },
        {
          name: CONTROL.name.plane,
          items: [
            {
              type: CONTROL.type.range,
              param: { ...Cubes.PLANE_PLAY.width, default: PLANE.width }
            },
            {
              type: CONTROL.type.range,
              param: { ...Cubes.PLANE_PLAY.height, default: PLANE.height }
            }
          ]
        }
      ]
    });
  };

  doSetTimeout = (i, cube, time = 100) => {
    window.setTimeout(() => {
      this.scene.remove(cube);
    }, time * i);
  };

  destroyCubes = time => {
    if (!this.state.isDestroying) {
      if (Object.values(this.cubes).length > 0) {
        this.setState({ isDestroying: true });
        let max = 0;
        let setOutTime = 0;

        // destroy X
        ["front", "back"].forEach(posType => {
          this.cubes.x[posType].forEach(cubeRow => {
            if (cubeRow.length - 1 > max) max = cubeRow.length - 1;
            cubeRow.forEach((cube, j) => this.doSetTimeout(j, cube, time));
          });
        });

        // find section time
        setOutTime = max * time;

        // after X is destroyed, destroy Y
        let lastRow = false;
        let max02 = 0;
        setTimeout(() => {
          ["front", "back"].forEach(posType => {
            const cubeRow = this.cubes.y[posType];
            for (let i = 0; i < cubeRow.length; i++) {
              const maxItemIndex = cubeRow[i].length - 1;
              if (maxItemIndex > max02) max02 = maxItemIndex;
              // check last row
              if (posType === "back" && i === cubeRow.length - 1) {
                lastRow = true;
                // check last cube
                if (cubeRow[i].length === 0) {
                  setTimeout(() => {
                    this.resetCubes();
                  }, time * max02);
                }
              }
              for (let j = 0; j < cubeRow[i].length; j++) {
                this.doSetTimeout(j, cubeRow[i][j], time);
                // check last cube
                if (lastRow && j === maxItemIndex) {
                  setTimeout(() => {
                    this.resetCubes();
                  }, time * max02);
                }
              }
            }
          });
        }, setOutTime);
      }
    } else {
      console.log("...destroying, please wait");
    }
  };

  setCameraPosition = (type, value) => {
    switch (type) {
      case Cubes.CAMERA_PLAY.x.label:
        this.camera.position.x = value;
        break;
      case Cubes.CAMERA_PLAY.y.label:
        this.camera.position.y = value;
        break;
      case Cubes.CAMERA_PLAY.z.label:
        this.camera.position.z = value;
        break;
      default:
        break;
    }
  };

  resetButtonPlay = (destroyStt, buildStt) => {
    let controlItemClone = this.state.controlItem.slice();
    controlItemClone.forEach(controlField => {
      if (controlField.name === CONTROL.name.play) {
        controlField.items.forEach(control => {
          if (control.param.label === Cubes.BUTTON_PLAY.destroy.label) {
            control.param.isDisabled = destroyStt;
          }

          if (control.param.label === Cubes.BUTTON_PLAY.build.label) {
            control.param.isDisabled = buildStt;
          }
        });
        return;
      }
    });

    this.setState({ controlItem: controlItemClone });
  };

  // Controls function
  changeInputControl = (i, j, e) => {
    let value = e.target.value;
    if (!isNumber(value)) return;

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
      if (control.label === Cubes.PLANE_PLAY.width.label) {
        const h = this.plane.height;
        this.createPlane(value, h);
      }

      if (control.label === Cubes.PLANE_PLAY.height.label) {
        const w = this.plane.width;
        this.createPlane(w, value);
      }
    }
  };

  onClickControl = (i, j) => {
    let controlItemClone = this.state.controlItem.slice();
    const control = controlItemClone[i].items[j].param;

    if (controlItemClone[i].name === CONTROL.name.play) {
      if (control.label === Cubes.BUTTON_PLAY.destroy.label) {
        this.destroyCubes(100);
      } else if (control.label === Cubes.BUTTON_PLAY.build.label) {
        this.build();
      }
    }
  };

  componentDidMount() {
    // need reset when re-enter
    this.resetControlItem();

    this.sceneSetup();
    this.customSceneSetup();
    this.createPlane(PLANE.width, PLANE.height);
    this.startAnimationLoop();
  }

  render() {
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

Cubes.contextType = WindowSizeContext;
export default Cubes;
