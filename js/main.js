import { MazeModel } from "./maze_model.js";
import { Controls } from "./controls.js";
import { RobotModel } from "./robot_model.js";
import { PathFinderBFS } from "./pathfinder_bfs.js";
import { PathFinderDFS } from "./pathfinder_dfs.js";
import { PathFinderAStar } from "./pathfinder_astar.js";
import { PathFinderDijkstra } from "./pathfinder_dijkstra.js";
import { ConfigLoader } from "./config.js";

const TWEEN = window.TWEEN;

async function initApp(config) {
  // Ocultar loader y mostrar canvas
  document.getElementById("loader-container").style.display = "none";
  document.getElementById("canvas-container").style.display = "block";

  // Configuración inicial
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x808080);

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  document.getElementById("canvas-container").appendChild(renderer.domElement);

  // Posición inicial de la cámara
  camera.position.set(7, 7, 7);
  camera.lookAt(0, 0, 0);

  // Crear el laberinto
  const mazeModel = new MazeModel(scene);
  await mazeModel.initialize(config);

  // Seleccionar e iniciar el algoritmo de búsqueda
  let pathFinder;
  let algorithmName = "dijkstra"; // Puedes cambiar esto para usar diferentes algoritmos

  switch (algorithmName) {
    case "bfs":
      pathFinder = new PathFinderBFS(mazeModel.mazeConfig.config);
      break;
    case "dfs":
      pathFinder = new PathFinderDFS(mazeModel.mazeConfig.config);
      break;
    case "astar":
      pathFinder = new PathFinderAStar(mazeModel.mazeConfig.config);
      break;
    case "dijkstra":
      pathFinder = new PathFinderDijkstra(mazeModel.mazeConfig.config);
      break;
    default:
      pathFinder = new PathFinderBFS(mazeModel.mazeConfig.config);
  }

  const path = pathFinder.findPath();

  // Crear e iniciar el robot
  const robotModel = new RobotModel(scene, mazeModel);
  if (path) {
    robotModel.followPath(path, 1000);
  }

  // Configurar controles
  const controls = new Controls(camera, renderer);

  // Función de animación
  function animate() {
    requestAnimationFrame(animate);
    TWEEN.update();
    controls.update();
    renderer.render(scene, camera);
  }

  // Manejar redimensionamiento de ventana
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Iniciar animación
  animate();
}

// Configurar el cargador de archivos
ConfigLoader.setupListeners((config) => {
  initApp(config);
});
