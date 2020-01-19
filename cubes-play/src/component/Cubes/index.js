import React, { Component } from "react";
import THREE from "THREE";
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

class Cubes extends Component {
  constructor() {
    super();
    this.state = {
      scene: null,
      camera: null,
      renderer: null,
      controls: null
    };
  }

  init = async () => {
    await this.setState({
      scene: new THREE.Scene(),
      camera: new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        1,
        1000
      ),
      renderer: new THREE.WebGLRenderer()
    });

    const { renderer, camera } = this.state;

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.state.renderer.domElement);

    camera.position.x = param.camera.x.default;
    camera.position.y = param.camera.y.default;
    camera.position.z = param.camera.z.default;

    this.setState({
      controls: new THREE.OrbitControls(camera, renderer.domElement)
    });
    this.state.controls.update();
  };

  componentDidMount() {
    console.log("solved");
    this.init();
  }

  render() {
    return <div></div>;
  }
}

export default Cubes;
