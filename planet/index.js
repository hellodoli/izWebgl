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

function createTriangle (p1, p2, p3) {
  let geometry = new THREE.Geometry();
  geometry.vertices.push(p1, p2, p3);
  geometry.faces.push(new THREE.Face3(0, 1, 2));

  geometry.computeFaceNormals();
  geometry.computeVertexNormals();
  return geometry;
}

// planet
let rings = [];
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

// diamond
let fragments = [];
function creatorDiamond () {
  const p1 = new THREE.Vector3(0, 2, 0); // 1 - top vertex
  const p2 = new THREE.Vector3(-1, 0, -1); // 2
  const p3 = new THREE.Vector3(1, 0, -1); // 3
  const p4 = new THREE.Vector3(-1, 0, 1); // 4
  const p5 = new THREE.Vector3(1, 0, 1); // 5
  const p6 = new THREE.Vector3(0, -2, 0); // 6 - bottom vertex

  // top fragment
  var geometry1 = createTriangle(p1, p2, p3); // back
  var geometry2 = createTriangle(p1, p2, p4); // left
  var geometry3 = createTriangle(p1, p3, p5); // right
  var geometry4 = createTriangle(p1, p4, p5); // front
  // bottom fragment
  var geometry5 = createTriangle(p2, p3, p6); // back
  var geometry6 = createTriangle(p2, p4, p6); // left
  var geometry7 = createTriangle(p3, p5, p6); // right
  var geometry8 = createTriangle(p4, p5, p6); // front

  fragments.push(new Fragment(new THREE.Vector3(0,0,0), new THREE.Vector3(0,0,-1), geometry1));
  fragments.push(new Fragment(new THREE.Vector3(0,0,0), new THREE.Vector3(-1,0,0), geometry2));
  fragments.push(new Fragment(new THREE.Vector3(0,0,0), new THREE.Vector3(1,0,0), geometry3));
  fragments.push(new Fragment(new THREE.Vector3(0,0,0), new THREE.Vector3(0,0,1), geometry4));

  fragments.push(new Fragment(new THREE.Vector3(0,0,0), new THREE.Vector3(0,-0.5,-1), geometry5));
  fragments.push(new Fragment(new THREE.Vector3(0,0,0), new THREE.Vector3(-1,-0.5,0), geometry6));
  fragments.push(new Fragment(new THREE.Vector3(0,0,0), new THREE.Vector3(1,-0.5,0), geometry7));
  fragments.push(new Fragment(new THREE.Vector3(0,0,0), new THREE.Vector3(0,-0.5,1), geometry8));
  
  fragments.forEach(fragment => scene.add(fragment.shape));

  var axesHelper = new THREE.AxesHelper( 5 );
  scene.add( axesHelper );
}

function render() {
  //fragments.forEach(fragment => fragment.move());

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

function openn () {
  fragments.forEach(fragment => fragment.open());
}

function closee () {
  fragments.forEach(fragment => fragment.close());
}