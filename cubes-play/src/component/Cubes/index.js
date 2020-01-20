import React, { Component } from "react";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { isNumber, randomRange } from "../../helper";

import { PLANE, CONTROL, CUBE, POS } from "../../constants/three";
import Plane from "../../object/Plane";

import Controls from "../Controls";

import "./styled/index.css";

/* Custom camera param */
const CAMERA_CUBES = {
  x: {
    default: 0,
    min: 1,
    max: 20
  },
  y: {
    default: 100,
    min: 50,
    max: 200
  },
  z: {
    default: 300,
    min: 100,
    max: 600
  }
};

class Cubes extends Component {
  constructor() {
    super();
    this.canvasContainer = React.createRef();
    this.state = {
      /* Default param setting */
      controlItem: [
        {
          name: "Camera",
          items: [
            {
              type: CONTROL.type.range,
              label: "Camera X",
              param: CAMERA_CUBES.x
            },
            {
              type: CONTROL.type.range,
              label: "Camera Y",
              param: CAMERA_CUBES.y
            },
            {
              type: CONTROL.type.range,
              label: "Camera Z",
              param: CAMERA_CUBES.z
            }
          ]
        },
        {
          name: "Play",
          items: [
            {
              type: CONTROL.type.button,
              label: "Destroy",
              color: "primary"
            },
            {
              type: CONTROL.type.button,
              label: "Build"
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

    this.camera.position.y = CAMERA_CUBES.y.default;
    this.camera.position.z = CAMERA_CUBES.z.default;

    var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    this.scene.add(directionalLight);

    //var axesHelper = new THREE.AxesHelper(50);
    //scene.add(axesHelper);
  };

  createPlane = () => {
    this.plane = new Plane(PLANE.width, PLANE.height);
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
    const maxCubeLevelXRound = parseInt(PLANE.height / (CUBE.z * 2));
    this.cubeLevel.x = [];
    for (let i = 0; i < maxCubeLevelXRound; i++) {
      this.cubeLevel.x[i] = { front: false, back: false };
    }

    // level Z
    const maxCubeLevelZRound = parseInt(PLANE.width / (CUBE.z * 2));
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

    // define cubeX, cubeY, cubeZ
    if (pos === POS.x) {
      this.cubeLevel.x[level][posType] = true;
      cubeZ = CUBE.z;
      cubeY = CUBE.y;
      limit = PLANE.width - 2 * level * cubeZ;
      //cubeX = Math.round(randomRange(1, (limit / 2)));
      this.cubes.x[posType][level] = [];
    } else {
      this.cubeLevel.y[level][posType] = true;
      cubeX = CUBE.z;
      cubeY = CUBE.y;
      limit = PLANE.height - 2 * (level + 1) * cubeX;
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
        cubePosX = PLANE.xRange.min + cubeZ * level + cubeXPrev + cubeX / 2;
        cubePosZ = isFront
          ? PLANE.zRange.max - cubeZ / 2 - level * cubeZ
          : PLANE.zRange.min + cubeZ / 2 + level * cubeZ;

        cubeXPrev += cubeX;
        this.cubes.x[posType][level].push(cube);
      } else {
        // front is left, back is right
        cubePosX = isFront
          ? PLANE.xRange.max - cubeX / 2 - level * cubeX
          : PLANE.xRange.min + cubeX / 2 + level * cubeX;
        cubePosZ =
          PLANE.zRange.min + cubeX * (level + 1) + cubeXPrev + cubeZ / 2;

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
    if (
      (cubes && cubes.x.front.length === 0 && cubes.y.front.length === 0) ||
      cubes === undefined
    ) {
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

  destroyCubes = () => {
    ["front", "back"].map(posType => {
      this.cubes.x[posType].forEach((cubeRow, i) => {
        cubeRow.forEach(cube => doSetTimeout(i, cube));

        setTimeout(function() {
          this.cubes.y[posType].forEach((cubeRow, i) => {
            cubeRow.forEach((cube, j) =>
              doSetTimeout(i, cube, function() {
                if (i === this.cubes.y[posType].length - 1) {
                  if (j === this.cubes.y[posType][i].length - 1) {
                    console.log("reset");
                  }
                }
              })
            );
          });
        }, (cubes.x[posType].length - 1) * time);
      });
    });
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
    if (controlItemClone[i].name === "Camera") {
      this.setCameraPosition(
        controlItemClone[i].items[0].param.default,
        controlItemClone[i].items[1].param.default,
        controlItemClone[i].items[2].param.default
      );
    }
  };

  setCameraPosition(x, y, z) {
    this.camera.position.x = x;
    this.camera.position.y = y;
    this.camera.position.z = z;
  }

  componentDidMount() {
    console.log("this.canvasContainer: ", this.canvasContainer);
    this.sceneSetup();
    this.customSceneSetup();
    this.createPlane();
    this.build();
    this.startAnimationLoop();
  }

  render() {
    return (
      <div className="live-show" ref={this.canvasContainer}>
        <Controls
          controlItem={this.state.controlItem}
          changeInputControl={this.changeInputControl}
        />
      </div>
    );
  }
}

export default Cubes;
