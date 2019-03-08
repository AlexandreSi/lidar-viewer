/* eslint-disable */
import SceneManager3D from 'components/SceneManager3D';
import { LasLoader } from 'utils/LASLoader';

export default (containerElement, changePercentage, toggleColorsLoaded) => {
  const canvas = createCanvas(document, containerElement);
  let pointCloud = undefined;
  let sceneManager = new SceneManager3D(canvas);
  loadPoints(toggleColorsLoaded);

  bindEventListeners();
  animate();

  function loadPoints(toggleColorsLoaded) {
    const fileURL = 'Block_589.las';

    const loader = new LasLoader(toggleColorsLoaded);

    const onLoaded = (pointsPromise, toggleColorsLoaded) => {

      pointsPromise.then((pointsData) => {
        pointCloud = pointsData;
        sceneManager.createSceneSubjects(sceneManager.scene, pointsData)
        toggleColorsLoaded()
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
      toggleColorsLoaded,
    );
  }

  function createCanvas(document, containerElement) {
    const canvas = document.createElement("canvas");
    canvas.requestPointerLock();
    containerElement.appendChild(canvas);
    return canvas;
  }

  function bindEventListeners() {
    window.onresize = resizeCanvas;
    window.onkeydown = handleKeyDown;
    window.onkeyup = handleKeyUp;
    resizeCanvas();
  }

  function resizeCanvas() {
    canvas.style.width = "100%";
    canvas.style.height= "100%";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    sceneManager.onWindowResize(canvas);
  }

  function handleKeyDown(event) {
    sceneManager.onKeyDown(event);
  }

  function handleKeyUp(event) {
    sceneManager.onKeyUp(event);
  }

  function animate() {
    requestAnimationFrame(animate);

    sceneManager.update();
  }
}
