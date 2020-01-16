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

//
// custom camera, background, light
function customBackground () {
  scene.background = new THREE.Color(0x6c757d);

  camera.position.z = 40;
  camera.position.y = 10;

  var directionalLight = new THREE.DirectionalLight( 0xffffff, .5 );
  scene.add(directionalLight);

  var axesHelper = new THREE.AxesHelper(50);
  scene.add(axesHelper);
};

// define default Plane, Cube
let cubes = []; // list array store cube
const maxCube = 3;
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
  }
};

const widthPlane = 55;
const heightPlane = 50;
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

function createPlane () {
  var geometry = new THREE.PlaneGeometry( PLANE.width, PLANE.height, (PLANE.width / 2), (PLANE.height / 2) );
  var material = new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide,
    color: 0xffffff,
    wireframe: true
  });
  var plane = new THREE.Mesh(geometry, material);
  plane.rotateX(-Math.PI*0.5);
  scene.add(plane);
};

function createCube () {
  const maxCubeAtXRound = parseInt(PLANE.width / CUBE.x);
  const maxCubeAtX =  ((PLANE.width / CUBE.x) > maxCubeAtXRound) ? (maxCubeAtXRound + 1) : maxCubeAtXRound;
  let i = 0;
  while (i < maxCubeAtX) {
    // khoảng cách từ 1 cube đến gốc tọa độ tính từ giữa cube đến gốc tọa độ
    // chứ không phải từ bên phải (trái) cùng của cube
    const cubePosX = PLANE.xRange.min + (CUBE.x / 2) + (i*CUBE.x);
    let cubeX = 0;
    if ((cubePosX + (CUBE.x / 2)) > PLANE.xRange.max) {
      // cut cube x
      cubeX = (CUBE.x / 2) + (PLANE.xRange.max - cubePosX);
    } else {
      cubeX = CUBE.x;
    }
    
    const geometry = new THREE.BoxGeometry(cubeX, CUBE.y, CUBE.z);
    const material = new THREE.MeshPhongMaterial({
      side: THREE.DoubleSide,
      shininess: 100,
      color: Math.random() * 0xffffff,
      wireframe: false
    });
    let cube = new THREE.Mesh(geometry, material);
    cube.position.z = 0;
    cube.position.x = (PLANE.xRange.min + (CUBE.x / 2) + (i*CUBE.x));
    cube.position.y = (CUBE.y / 2); // cube will upper plane
    if (i === 4) {
      console.log(cube);
    }
    cubes.push(cube);
    scene.add(cube);
    i++;
  }
  
  /*for (let i = 0; i < maxCube; i++) {
    var material = new THREE.MeshPhongMaterial({
      side: THREE.DoubleSide,
      shininess: 100,
      color: Math.random() * 0xffffff,
      wireframe: false
    });
    var cube = new THREE.Mesh(geometry, material);
    cube.position.x = randomRange(-20,20);
    cube.position.z = randomRange(-10,10);
    cube.position.y = (yCube*0.5);
    cubes.push(cube);
    scene.add(cube);
  }*/

  /* while (cubes.length < 21) {
      // material
      var x = randomRange(-20,20);
      var y
    }
  */
};

function render () {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
};