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

  //var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
  //scene.add( directionalLight );

  controls = new THREE.OrbitControls( camera, renderer.domElement );
  controls.update();
}


//
// custom camera, background, light
function customBackground () {
  scene.background = new THREE.Color(0x6c757d);
  camera.position.z = 40;
  camera.position.y = 10;
  var directionalLight = new THREE.DirectionalLight( 0xffffff, .5 );
  scene.add(directionalLight);
}

let cubes = [];
const maxCube = 3;
const PLANE = {
  width: 50,
  height: 50,
  xRange: {
    min: -(PLANE.width / 2),
    max: (PLANE.width / 2)
  },
  zRange: {
    min: -(PLANE.height / 2),
    max: (PLANE.height / 2)
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
  }
};

function createPlane () {
  var geometry = new THREE.PlaneGeometry( PLANE.width, PLANE.height, (PLANE.width / 2), (PLANE.height / 2) );
  var material = new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide,
    color: 0xffffff,
    wireframe: true
  });
  var p = new THREE.Mesh(geometry, material);
  p.rotateX(-Math.PI*0.5);
  scene.add(p);
};

function createCube () {
  const geometry = new THREE.BoxGeometry(CUBE.x, CUBE.y, CUBE.z);
  var material = new THREE.MeshPhongMaterial({
    side: THREE.DoubleSide,
    shininess: 100,
    color: Math.random() * 0xffffff,
    wireframe: false
  });
  var cube = new THREE.Mesh(geometry, material);
  cube.position.x = (PLANE.xRange.min) - CUBE.x;
  cube.position.z = 0;
  cube.position.y = (CUBE.y*0.5); // cube will upper plane
  cubes.push(cube);
  scene.add(cube);
  
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