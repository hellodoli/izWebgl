// define default param for camera, scene, ...
const param = {
  camera: {
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
  }
};
let scene, camera, renderer, controls;

function init () {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera (
    75,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  camera.position.x = param.camera.x.default;
  camera.position.y = param.camera.y.default;
  camera.position.z = param.camera.z.default;

  controls = new THREE.OrbitControls( camera, renderer.domElement );
  controls.update();
};

// custom camera, background, light
function customBackground () {
  scene.background = new THREE.Color(0x6c757d);

  camera.position.z = 300;
  camera.position.y = 100;

  var directionalLight = new THREE.DirectionalLight( 0xffffff, .5 );
  scene.add(directionalLight);

  var axesHelper = new THREE.AxesHelper(50);
  scene.add(axesHelper);
};

// define default param
let cubeLevel = {};
let cubes = {
  x: {
    front: [],
    back: []
  },
  y: {
    front: [],
    back: []
  }
};
const CUBE = {
  x: 10,
  y: 3,
  z: 5,
  xRange: {
    max: 20,
    min: -20
  },
  zRange: {
    max: 20,
    min: -20
  },
  material: {
    side: THREE.DoubleSide,
    shininess: 100,
    color: 0xffffff,
    wireframe: false
  }
};

const widthPlane = 200;
const heightPlane = 200;
const PLANE = {
  width: widthPlane,
  height: heightPlane,
  xRange: {
    min: -(widthPlane / 2),
    max: (widthPlane / 2),
  },
  zRange: {
    min: -(heightPlane / 2),
    max: (heightPlane / 2)
  }
};

const POS = {
  x: 'X',
  y: 'Y'
};

function createPlane () {
  const geometry = new THREE.PlaneGeometry( PLANE.width, PLANE.height, (PLANE.width / 2), (PLANE.height / 2) );
  const material = new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide,
    color: 0xffffff,
    wireframe: true
  });
  const plane = new THREE.Mesh(geometry, material);
  plane.rotateX(-Math.PI*0.5);
  scene.add(plane);
};

function makeCubeLevel (callback) {
  // level X
  const maxCubeLevelXRound = parseInt(PLANE.height / (CUBE.z * 2));
  cubeLevel.x = [];
  for (let i = 0; i < maxCubeLevelXRound; i++) {
    cubeLevel.x[i] = { front : false, back: false };
  }

  // level Z
  const maxCubeLevelZRound = parseInt(PLANE.width / (CUBE.z * 2));
  cubeLevel.y = [];
  for (let i = 0; i < maxCubeLevelZRound; i++) {
    cubeLevel.y[i] = { front : false, back: false };
  }

  callback(cubeLevel);
};

function createCubeRandom (isFront, level, pos) {
  level = parseInt(level);
  if (level >= (cubeLevel.x.length) || level < 0 || isNaN(level)) return;

  const posType = isFront ? 'front' : 'back';
  if (cubeLevel.x[level][posType] === true) return;
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
    cubeLevel.x[level][posType] = true;
    cubeZ = CUBE.z;
    cubeY = CUBE.y;
    limit = PLANE.width - (2*level*cubeZ);
    //cubeX = Math.round(randomRange(1, (limit / 2)));
    cubes.x[posType][level] = [];
  } else {
    cubeLevel.y[level][posType] = true;
    cubeX = CUBE.z;
    cubeY = CUBE.y;
    limit = PLANE.height - (2*(level + 1)*cubeX);
    //cubeZ = Math.round(randomRange(1, (limit / 2)));
    cubes.y[posType][level] = [];
  }

  while (d < limit) {
    indexCube += 1;
    if (pos === POS.x) {
      cubeX = Math.round(randomRange(1, (limit / 2)));
      d += cubeX;
    } else {
      cubeZ = Math.round(randomRange(1, (limit / 2)));
      d += cubeZ;
    }

    // cut last cube
    if (d > limit) {
      if (pos === POS.x) cubeX -= (d - limit);
      else cubeZ -= (d - limit);
      d = limit;
    }

    // create Cube
    const geometry = new THREE.BoxGeometry(cubeX, cubeY, cubeZ);
    CUBE.material.color = Math.random() * 0xffffff;
    const material = new THREE.MeshPhongMaterial(CUBE.material);
    const cube = new THREE.Mesh(geometry, material);

    // setting position
    const cubePosY = (cubeY / 2) + (level*cubeY);
    let cubePosX;
    let cubePosZ;
    if (pos === POS.x) {
      cubePosX = PLANE.xRange.min + (cubeZ*level) + cubeXPrev + (cubeX / 2);
      cubePosZ = (isFront)
        ? (PLANE.zRange.max - (cubeZ / 2) - (level*cubeZ))
        : (PLANE.zRange.min + (cubeZ / 2) + (level*cubeZ));

      cubeXPrev += cubeX;
      cubes.x[posType][level].push(cube);
    } else {
      // front is left, back is right
      cubePosX = (isFront)
        ? (PLANE.xRange.max - (cubeX / 2) - (level*cubeX))
        : (PLANE.xRange.min + (cubeX / 2) + (level*cubeX));
      cubePosZ = PLANE.zRange.min + (cubeX*(level + 1)) + cubeXPrev + (cubeZ /2);

      cubeXPrev += cubeZ;
      cubes.y[posType][level].push(cube);
    }

    cube.position.x = cubePosX;
    cube.position.y = cubePosY;
    cube.position.z = cubePosZ;

    scene.add(cube);
  }
};

let isBuild = false;
function build () {
  if (cubes.x.front.length === 0 && cubes.y.front.length === 0) {
    makeCubeLevel(cubeLevel => {
      console.log("cubeLevel: ", cubeLevel);
      for (let y = 0; y < cubeLevel.y.length; y++) {
        createCubeRandom(false, y, POS.y);
        createCubeRandom(true, y, POS.y);
      }

      for (let x = 0; x < cubeLevel.x.length; x++) {
        createCubeRandom(false, x, POS.x);
        createCubeRandom(true, x, POS.x);
      }
    });
  }
};

function render () {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
};

var time = 100;
function doSetTimeout (i, cube, callback) {
  setTimeout(function () {
    scene.remove(cube);
    if (typeof callback === 'function') {
      callback();
    }
  }, (time*i));
};

function deleteAll () {
  ['front','back'].map(posType => {
    cubes.x[posType].forEach((cubeRow, i) => {
      cubeRow.forEach(cube => doSetTimeout(i, cube));

      setTimeout(function () {
        cubes.y[posType].forEach((cubeRow, i) => {
          cubeRow.forEach((cube, j) => doSetTimeout(i, cube, function () {
            if (i === (cubes.y[posType].length - 1)) {
              if (j === (cubes.y[posType][i].length - 1)) {
                console.log('reset');
              }
            }
          }));
        });
      }, ((cubes.x[posType].length - 1)*time));
    });
  });
};

function reBuild () {
  build();
};