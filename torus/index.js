// Controls element
const cameraPosX = "#cameraPosX";
const cameraPosY = "#cameraPosY";
const cameraPosZ = "#cameraPosZ";
// Default variable
let scene, camera, renderer, controls, torus, toruses = [];
const param = {
  camera: {
    x: {
      default: 0,
      min: 1,
      max: 20
    },
    y: {
      default: -10,
      min: -10,
      max: 20
    },
    z: {
      default: 40,
      min: 1,
      max: 100
    }
  }
};


// controls function
function setValueInputRangeControl (inputRangeId, inputRangeViewId, param) {
  const $inputRange = $(inputRangeId);
  if ($inputRange.length > 0) {
    $inputRange
    .val(param.default)
    .attr({
      min: param.min,
      max: param.max
    });
  }

  const $inputRangeView = $(inputRangeViewId);
  if ($inputRangeView.length > 0) {
    $inputRangeView.val(param.default);
  }
}

function initControls() {
  setValueInputRangeControl(cameraPosX, (cameraPosX + 'View'), param.camera.x);
  setValueInputRangeControl(cameraPosY, (cameraPosY + 'View'), param.camera.y);
  setValueInputRangeControl(cameraPosZ, (cameraPosZ + 'View'), param.camera.z);
}

function changeCtrVal (ele) {
  var val = parseInt(ele.value);
  if ( isNaN(val) || val > ele.max || val < ele.min) return;

  var s = ele.id.search('View');
  const id = (s !== -1) ? `#${ele.id.substr(0, s)}` : `#${ele.id}View`;
  $(id).val(val);

  var type = ele.id.search('camera');
  if (type !== -1) {
    // update camera
    var posType = ele.id.substring((ele.id.length - 1), ele.id.length);
    if (camera) {
      if (posType === 'X') {
        camera.position.x = val;
      } else if (posType === 'Y') {
        camera.position.y = val;
      } else if (posType === 'Z') {
        camera.position.z = val;
      }
    }
  }
}


// webgl function
function randomInRange (from, to) {
  if (to > from) {
    var x = Math.random()*(to - from);
    return (from + x);
  }
  return null;
}

function createTorus () {
  var geometry = new THREE.TorusGeometry(1, .5, 5, 30, Math.PI*2);
  var material = new THREE.MeshBasicMaterial({
    color: Math.random() * 0xffffff,
    wireframe: true
  });

  var torus = new THREE.Mesh(geometry, material);
  torus.position.x = randomInRange(-15, 15);
  torus.position.z = randomInRange(-15, 15);
  torus.position.y = 15;

  scene.add(torus);
  toruses.push(torus);
}

function createTorusGlobal () {
  var geometry = new THREE.TorusGeometry(1, .5, 5, 30, Math.PI*2);
  var material = new THREE.MeshBasicMaterial({
    color: 0xffff00,
    wireframe: true
  });
  torus = new THREE.Mesh(geometry, material);
  console.log('torus: ', torus);
  scene.add(torus);
  toruses.push(torus);
}

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

function render() {
  /*if (Math.random() < 0.1) {
    createTorus();
  }*/
  
  /*toruses.forEach(torus => {
    torus.position.y -= .1;
    torus.rotation.x += .1;
    torus.rotation.y += .1;
  });*/
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

function clearr () {
  scene.remove(torus);
}