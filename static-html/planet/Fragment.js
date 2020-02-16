class Fragment {
  constructor (position, velocity, geometry) {
    this.gap = 1;
    this.velocity = velocity;
    this.velocity.multiplyScalar(this.gap);
    var material = new THREE.MeshPhongMaterial({
      side: THREE.DoubleSide,
      color: 0xffffff,
      emissive: 0xfafafa,
      emissiveIntensity: 0.4,
      shininess: 100,
      specular: 0x9d0a00,
      vertexColors: true,
    });
    //var material = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, color: 0xffffff, wireframe: true });
    this.shape = new THREE.Mesh(geometry, material);
    this.shape.position.copy(position);
  }

  move () {
    this.shape.position.add(this.velocity);
  }

  open () {
    this.shape.position.copy(this.velocity);
  }

  close () {
    this.shape.position.copy(new THREE.Vector3(0,0,0));
  }

  changeGap (gap) {
    this.gap = gap;
  }
}