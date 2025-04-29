import { MazeModel } from "./maze_model.js";
import { Controls } from "./controls.js";
import { RobotModel } from "./robot_model.js";
import { PathFinderBFS } from "./pathfinder_bfs.js";
import { PathFinderDFS } from "./pathfinder_dfs.js";
import { PathFinderAStar } from "./pathfinder_astar.js";

const TWEEN = window.TWEEN;

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

// Crear el laberinto y los controles
const mazeModel = new MazeModel(scene);
await mazeModel.initialize("/data/maze-runner.json");

/*
// Ejecutar búsqueda BFS una vez que el laberinto está cargado
const pathFinder = new PathFinderBFS(mazeModel.mazeConfig.config);
const path = pathFinder.findPath();
*/

/*
// Ejecutar búsqueda DFS una vez que el laberinto está cargado
const pathFinder = new PathFinderDFS(mazeModel.mazeConfig.config);
const path = pathFinder.findPath();
*/

// Ejecutar búsqueda A* una vez que el laberinto está cargado
const pathFinder = new PathFinderAStar(mazeModel.mazeConfig.config);
const path = pathFinder.findPath();

// Crear el robot después de que el laberinto esté inicializado
const robotModel = new RobotModel(scene, mazeModel);

// Iniciar la animación del robot
if (path) {
  robotModel.followPath(path, 1000); // 1000ms de delay entre cada movimiento
}

// Create controls after scene and camera are initialized
const controls = new Controls(camera, renderer);

// Make sure to call update in your animation loop
function animate() {
  requestAnimationFrame(animate);
  TWEEN.update(); // Actualizar las animaciones
  controls.update();
  renderer.render(scene, camera);
}

// Manejar el redimensionamiento de la ventana
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
