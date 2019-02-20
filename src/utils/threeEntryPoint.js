/* eslint-disable */
import SceneManager3D from 'components/SceneManager3D';
import { LasLoader } from 'utils/LASLoader';

export default (containerElement, changePercentage) => {
  const canvas = createCanvas(document, containerElement);
  let pointCloud = undefined;
  let sceneManager = new SceneManager3D(canvas);
  loadPoints(null);

  bindEventListeners();
  animate();

  function loadPoints(fileToOpen) {
    const fileURL = 'Block_589.las';

    const loader = new LasLoader();

    const onLoaded = (pointsPromise) => {
      pointsPromise.then((pointsData) => {
        pointCloud = pointsData;
        sceneManager.createSceneSubjects(sceneManager.scene, pointsData);
      });
    }

    const onProgress = (xhr) => {
      changePercentage(xhr.loaded / xhr.total * 100)
    }

    const onError = (error) => {
      window.alert(error || 'An error happened when downloading the file');
    }

    loader.load(
      fileURL,
      onLoaded,
      onProgress,
      onError,
    );
  }

  function createCanvas(document, containerElement) {
    const canvas = document.createElement('canvas');
    containerElement.appendChild(canvas);
    return canvas;
  }

  function bindEventListeners() {
    window.onkeydown = handleKeyPress;
    window.onresize = resizeCanvas;
    window.onmousemove = handleMouse;
    window.ondblclick = handleDoubleClick;
    resizeCanvas();
  }

  function resizeCanvas() {
    canvas.style.width = '100%';
    canvas.style.height= '100%';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    sceneManager.onWindowResize();
  }

  function handleMouse(event) {
    sceneManager.onMouseMove(event);
  }

  function preventDefaultAction(event){
    event.preventDefault();
    event.stopPropagation();
  }

  function handleKeyPress(event) {
    switch (true){
      case ([37, 38, 39, 40].includes(event.keyCode)):
        preventDefaultAction(event)
        sceneManager.onArrowKeyPress(event.keyCode);
        break;
      case (event.keyCode === 32):
        preventDefaultAction(event)
        sceneManager.onSpaceKeyPress();
        break;
      default:
        break;
    }
  }

  function handleDoubleClick(event) {
    const point = sceneManager.onMouseDoubleClick(event);
  }

  function handleViewChange(event) {
    const { viewType } = event.detail;
    switch (viewType) {
      case "3D":
        sceneManager = new SceneManager3D(canvas);
        break;
      default:
        window.alert("Error: the requested view type is not available")
    }
    sceneManager.createSceneSubjects(sceneManager.scene, pointCloud);
    bindEventListeners();
  }

  function animate() {
    requestAnimationFrame(animate);
    render()
  }

  function render() {
    sceneManager.update();
  }
}
