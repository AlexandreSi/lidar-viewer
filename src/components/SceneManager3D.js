import {
  Float32BufferAttribute,
  VertexColors,
  BufferGeometry,
  PointsMaterial,
  Points,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer,
} from 'three-full';

import { PointerLockControls } from 'utils/PointerLockControls';

export default (canvas) => {

  const screenDimensions = {
    width: canvas.width,
    height: canvas.height
  }

  const scene = buildScene();
  const renderer = buildRenderer(screenDimensions, canvas);
  const camera = buildCamera(screenDimensions);
  const controls = buildControls(camera);
  scene.add(controls.getObject());

  let moveForward = false;
  let moveLeft = false;
  let moveBackward = false;
  let moveRight = false;
  let prevTime = performance.now();
  let velocity = new Vector3();
  let direction = new Vector3();

  function buildScene() {
    const scene = new Scene();
    return scene;
  }

  function buildRenderer({ width, height }, canvas) {
    const devicePixelRatio = window.devicePixelRatio || 1;
    const renderer = new WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true
    });
    renderer.setPixelRatio(devicePixelRatio);
    renderer.setSize(width, height);

    return renderer;
  }

  function buildCamera({ width, height }) {
    const camera = new PerspectiveCamera(75, width / height, 1, 1000);

    return camera;
  }

  function spawn(controlsObject) {
    controlsObject.position.set(50.53, 4.88, 4.33);
    controlsObject.rotation.y = - 3.36;
  }

  function buildControls(camera) {
    const controls = new PointerLockControls(camera);
    controls.enabled = true;
    const controlsObject = controls.getObject()
    spawn(controlsObject);

    return controls
  }

  function createSceneSubjects(scene, { position, color }) {
    var geometry = new BufferGeometry();
    geometry.addAttribute(
      'position',
      new Float32BufferAttribute(position, 3)
  );
    geometry.addAttribute(
      'color',
      new Float32BufferAttribute(color, 3)
  );
    geometry.computeBoundingSphere();

    // build material

    var material = new PointsMaterial({
      size: 0.1,
      vertexColors: VertexColors,
    });

    // build mesh
    var mesh = new Points(geometry, material);
    mesh.name = 'pointCloud';
    scene.add(mesh);
  }

  function update() {
    let time = performance.now();
    let delta = (time - prevTime) / 1000;

    velocity.x -= velocity.x * 10.0 * delta;
		velocity.z -= velocity.z * 10.0 * delta;

    direction.z = Number(moveForward) - Number(moveBackward);
    direction.x = Number(moveLeft) - Number(moveRight);
    direction.normalize();

    if (moveForward || moveBackward) velocity.z -= direction.z * 50.0 * delta;
    if (moveLeft || moveRight) velocity.x -= direction.x * 50.0 * delta;

    controls.getObject().translateX(velocity.x * delta);
    controls.getObject().translateY(velocity.y * delta);
    controls.getObject().translateZ(velocity.z * delta);

    prevTime = time;

    renderer.render(scene, camera);
  }

  function onWindowResize(canvas) {
    const { width, height } = canvas;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    screenDimensions.width = width;
    screenDimensions.height = height;

    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function onKeyDown(event) {
    deactivateKey(event);
    switch (event.keyCode) {
      case 38: // up
      case 90: // z
        moveForward = true;
        break;
      case 37: // left
      case 81: // q
        moveLeft = true;
        break;
      case 40: // down
      case 83: // s
        moveBackward = true;
        break;
      case 39: // right
      case 68: // d
        moveRight = true;
        break;
      default:
        break;
    }
  };

  function deactivateKey(event) {
    if (event.keyCode in [ 38, 90, 37, 81, 40, 83, 39, 68]) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  function onKeyUp(event) {
    deactivateKey(event);
    switch (event.keyCode) {
      case 38: // up
      case 90: // z
        moveForward = false;
        break;
      case 37: // left
      case 81: // q
        moveLeft = false;
        break;
      case 40: // down
      case 83: // s
        moveBackward = false;
        break;
      case 39: // right
      case 68: // d
        moveRight = false;
        break;
      default:
        break;
    }
  };


  return {
    update,
    onKeyDown,
    onKeyUp,
    onWindowResize,
    createSceneSubjects,
    scene,
  }
}
