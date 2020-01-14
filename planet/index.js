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
      default: 20,
      min: 1,
      max: 100
    }
  }
};
let scene, camera, renderer, controls, rings = [];

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
}

function createPlanet () {
  var geometry = new THREE.SphereGeometry(4, 30, 30);
  var material = new THREE.MeshBasicMaterial({
    color: 0x8d5524,
    //wireframe: true
  });
  var planet = new THREE.Mesh(geometry, material);
  scene.add(planet);


  geometry = new THREE.TorusGeometry(5.1, .7, 2, 50);
  material = new THREE.MeshBasicMaterial({
    color: 0xffe39f,
    //wireframe: true
  });
  var ring1 = new THREE.Mesh(geometry, material);
  rings.push(ring1);


  geometry = new THREE.TorusGeometry(6.9, .7, 2, 50);
  material = new THREE.MeshBasicMaterial({
    color: 0xffad60,
    //wireframe: true
  });
  var ring2 = new THREE.Mesh(geometry, material);
  rings.push(ring2);


  geometry = new THREE.TorusGeometry(8.5, .7, 2, 50);
  material = new THREE.MeshBasicMaterial({
    color: 0xeac086,
    //wireframe: true
  });
  var ring3 = new THREE.Mesh(geometry, material);
  rings.push(ring3);

  rings.forEach(ring => {
    ring.rotation.y = 0.5;
    ring.rotation.x = 1.7;
    scene.add(ring);
  });
  
  var axes = new THREE.AxesHelper(10);
  scene.add(axes);
}

function creator () {
  var geometry = new THREE.Geometry();
  geometry.vertices.push(new THREE.Vector3(0, 0, 0)); // 0
  geometry.vertices.push(new THREE.Vector3(10, 0, 0)); // 1
  geometry.vertices.push(new THREE.Vector3(10, 5, 0)); // 2
  geometry.vertices.push(new THREE.Vector3(0, 5, 0)); // 3

  geometry.faces.push(new THREE.Face3(0, 3, 1));
  geometry.faces.push(new THREE.Face3(0, 2, 1));
  geometry.faces.push(new THREE.Face3(3, 2, 1));

  var material = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
  var sphere = new THREE.Mesh(geometry, material);
  scene.add(sphere);
}

function render() {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}