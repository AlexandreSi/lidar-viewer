/* eslint-disable */
import uniqueId from 'lodash/uniqueId';

import {
  AxesHelper,
  Float32BufferAttribute, 
  VertexColors,
  BufferGeometry,
  PointsMaterial, 
  Points, 
  DodecahedronGeometry,
  FaceColors,
  Mesh,
  MeshBasicMaterial,
  PCDLoader2,
  PerspectiveCamera,
  Raycaster,
  Scene,
  TrackballControls,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three-full';

export default (canvas) => {

  const screenDimensions = {
    width: canvas.width,
    height: canvas.height
  }

  const mouseVector = new Vector2();

  const pointCloudName = 'pointCloud';

  const scene = buildScene();
  const renderer = buildRenderer(screenDimensions);
  const camera = buildCamera(screenDimensions, scene);
  const controls = buildControls(camera, canvas);

  function buildScene() {
    const scene = new Scene();
    const axesHelper = new AxesHelper(10);
    scene.add(axesHelper);

    return scene;
  }

  function buildRenderer({ width, height }) {
    const devicePixelRatio = window.devicePixelRatio || 1;
    const renderer = new WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true
    });
    renderer.setPixelRatio( devicePixelRatio );
    renderer.setSize( width, height );

    return renderer;
  }

  function buildCamera({ width, height }, scene) {
    const camera = new PerspectiveCamera( 10, width / height, 1, 1000 );
    resetCamera(camera);

    return camera;
  }

  function resetCamera(camera) {
    camera.position.set(400, 400, 100);
    camera.up = new Vector3( 0, 0, 1 );
    camera.lookAt( scene.position );
    if (controls){
      controls.target = new Vector3( 0, 0, 0 );
      controls.update();
    }
  }

  function buildControls(camera, canvas) {
    const controls = new TrackballControls(camera, canvas);

    controls.rotateSpeed = 2.0;
    controls.zoomSpeed = 3.2;
    controls.panSpeed = 0.2;
    controls.noZoom = false;
    controls.noPan = false;
    controls.staticMoving = false;
    controls.dynamicDampingFactor = 1;

    return controls
  }

  function createSceneSubjects(scene, { position, color }) {
    var url = 'pointCloud';
    var geometry = new BufferGeometry();
    geometry.addAttribute(
      'position',
      new Float32BufferAttribute( position, 3 )
    );
    geometry.addAttribute(
      'color',
      new Float32BufferAttribute( color, 3 )
    );
    geometry.computeBoundingSphere();

    // build material

    var material = new PointsMaterial({
      size: 0.2,
      vertexColors: VertexColors,
    });

    // build mesh
    var mesh = new Points( geometry, material );
    var name = url.split( '' ).reverse().join( '' );
    name = /([^/]*)/.exec( name );
    name = name[ 1 ].split( '' ).reverse().join( '' );
    mesh.name = name;
    scene.add(mesh);
  }

  function update() {
    controls.update();
    renderer.render(scene, camera);
  }

  function onWindowResize() {
    const { width, height } = canvas;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    screenDimensions.width = width;
    screenDimensions.height = height;

    renderer.setSize( window.innerWidth, window.innerHeight );

    controls.handleResize();
  }

  function removeObjectsByName(scene, name) {
    const sceneChildren = scene.children;
    for (let child in sceneChildren) {
      if (sceneChildren[child].name === name) {
        scene.remove(sceneChildren[child])
      }
    }
  }

  function onRemoveSection(scene) {
    const deletePoints = (event) => {
      const pointNames = event.detail.pointNames;
      removeObjectsByName(scene, pointNames[0]);
      removeObjectsByName(scene, pointNames[1]);
    }
    return deletePoints
  }

  function onMouseMove(event) {
    event.preventDefault();

    const raycaster = new Raycaster();

    mouseVector.x =  2 * (event.clientX / window.innerWidth) - 1;
    mouseVector.y =  1 - 2 * ( event.clientY / window.innerHeight );

    raycaster.setFromCamera(mouseVector, camera);
    raycaster.params.Points.threshold = 0.05;

    const mesh = scene.getObjectByName(pointCloudName)
    removeObjectsByName(scene, 'highlightPoint')


    if (mesh) {
      const intersects = raycaster.intersectObject(mesh, true);

      if (intersects.length > 0) {
        const distance_min = intersects[0].distance;
        const nearestIntersects = intersects.filter(intersect => intersect.distance <= distance_min + 1);

        for (let i = 0; i < nearestIntersects.length; i++) {
          const intersection = nearestIntersects[ i ]
          const dodecahedronGeometry = new DodecahedronGeometry(0.02)
          dodecahedronGeometry.faces.map(face => face.color.setHex( 0xff0000 ))
          const material = new MeshBasicMaterial( { vertexColors: FaceColors, overdraw: 0.5 } );

          const dodecahedron = new Mesh( dodecahedronGeometry, material );
          dodecahedron.position.x = intersection.point.x
          dodecahedron.position.y = intersection.point.y
          dodecahedron.position.z = intersection.point.z
          dodecahedron.name = 'highlightPoint'
          scene.add( dodecahedron );
        }
      }
    }
  }

  function getPointUnderMouse() {
    const raycaster = new Raycaster();
    raycaster.setFromCamera(mouseVector, camera);
    raycaster.params.Points.threshold = 0.05;
    let x_mean = 0;
    let y_mean = 0;
    let z_mean = 0;

    // raycaster.set( camera.position, mouseVector.sub( camera.position ).normalize() );
    const intersects = raycaster.intersectObject(scene.getObjectByName(pointCloudName), true);
    if (intersects.length > 0) {
      const distance_min = intersects[0].distance;
      const nearestIntersects = intersects.filter(intersect => intersect.distance <= distance_min + 1);
      const coordinates = nearestIntersects.reduce((accumulator, currentValue) => {
        accumulator[0] += currentValue.point.x;
        accumulator[1] += currentValue.point.y;
        accumulator[2] += currentValue.point.z;
        return accumulator
      }, [0, 0, 0])
      x_mean = coordinates[0] / nearestIntersects.length;
      y_mean = coordinates[1] / nearestIntersects.length;
      z_mean = coordinates[2] / nearestIntersects.length;
    }
    return new Vector3(x_mean, y_mean, z_mean);
  }

  function onMouseDoubleClick(event) {
    event.preventDefault();

    const mouseVector = new Vector2();
    const raycaster = new Raycaster();

    mouseVector.x =  2 * (event.clientX / window.innerWidth) - 1;
    mouseVector.y =  1 - 2 * ( event.clientY / window.innerHeight );

    //mouseVector.unproject( camera );
    raycaster.setFromCamera(mouseVector, camera);
    raycaster.params.Points.threshold = 0.05;
    let x_mean = 0;
    let y_mean = 0;
    let z_mean = 0;
    let name = uniqueId('origin_');

    // raycaster.set( camera.position, mouseVector.sub( camera.position ).normalize() );
    const intersects = raycaster.intersectObject( scene.getObjectByName(pointCloudName), true );
    if (intersects.length > 0) {
      const distance_min = intersects[0].distance;
      const nearestIntersects = intersects.filter(intersect => intersect.distance <= distance_min + 1);
      const coordinates = nearestIntersects.reduce((accumulator, currentValue) => {
        accumulator[0] += currentValue.point.x;
        accumulator[1] += currentValue.point.y;
        accumulator[2] += currentValue.point.z;
        return accumulator
      }, [0, 0, 0])
      x_mean = coordinates[0] / nearestIntersects.length
      y_mean = coordinates[1] / nearestIntersects.length
      z_mean = coordinates[2] / nearestIntersects.length
      name = uniqueId('point_');
      const dodecahedronGeometry = new DodecahedronGeometry(0.1)
      dodecahedronGeometry.faces.map(face => face.color.setHex( 0x7af442 ))
      const material = new MeshBasicMaterial( { vertexColors: FaceColors, overdraw: 0.5 } );

      const dodecahedron = new Mesh( dodecahedronGeometry, material );

      dodecahedron.position.x = x_mean;
      dodecahedron.position.y = y_mean;
      dodecahedron.position.z = z_mean;
      dodecahedron.name = name;
      scene.add( dodecahedron );
      update();
    }

    return {
      name: name,
      position: {
        x: x_mean,
        y: y_mean,
        z: z_mean,
      }
    }
  }

  function onArrowKeyPress(keyCode){
    const target = getPointUnderMouse();
    const upVect = new Vector3( 0, 0, 1 );
    const anHorizontalVect = new Vector3( 0, -1, 0 );
    switch (keyCode) {
      case 37:
        camera.position.set(target.x + 30, target.y, target.z);
        camera.up = upVect;
        focusTarget(target);
        break;
      case 38:
        camera.position.set(target.x, target.y, target.z + 50);
        camera.up = anHorizontalVect;
        focusTarget(target);
        break;
      case 39:
        camera.position.set(target.x - 30, target.y, target.z);
        camera.up = upVect;
        focusTarget(target);
        break;
      case 40:
        resetCamera(camera);
        break;
      default:
        camera.position.set(0, 0, 0);
        camera.up = upVect;
    }
  }

  function focusTarget(target){
    controls.target = target;
    controls.update();
    camera.lookAt(target);
  }

  function onSpaceKeyPress(){
    const target = getPointUnderMouse();
    camera.up = new Vector3(0, 0, 1);
    controls.target = target;
    controls.update();
    camera.lookAt(target);
  }

  return {
    update,
    onWindowResize,
    onMouseMove,
    onMouseDoubleClick,
    onArrowKeyPress,
    onSpaceKeyPress,
    onRemoveSection,
    createSceneSubjects,
    scene,
  }
}
