import * as THREE from "three";

class Plane {
  constructor(width, height, color = 0xffffff) {
    this.width = width;
    this.height = height;
    this.xRange = {
      min: -(width / 2),
      max: width / 2
    };
    this.zRange = {
      min: -(height / 2),
      max: height / 2
    };
    this.color = color;
    this.makeShape();
  }

  makeShape() {
    const geometry = new THREE.PlaneGeometry(
      this.width,
      this.height,
      this.width / 2,
      this.height / 2
    );
    const material = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
      color: this.color,
      wireframe: true
    });
    this.shape = new THREE.Mesh(geometry, material);
  }

  setWidth(width) {
    this.width = width;
    this.xRange = {
      min: -(width / 2),
      max: width / 2
    };
  }

  setHeight(height) {
    this.height = height;
    this.zRange = {
      min: -(height / 2),
      max: height / 2
    };
  }

  setColor(color) {
    this.color = color;
  }
}

export default Plane;
