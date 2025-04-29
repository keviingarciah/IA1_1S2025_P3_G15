import { MazeModel } from "./maze_model.js";
import { Controls } from "./controls.js";
import { RobotModel } from "./robot_model.js";
import { PathFinderBFS } from "./pathfinder_bfs.js";
import { PathFinderDFS } from "./pathfinder_dfs.js";
import { PathFinderAStar } from "./pathfinder_astar.js";
import { PathFinderDijkstra } from "./pathfinder_dijkstra.js";
import { ConfigLoader } from "./config_loader.js";
import { AlgorithmSelector } from "./algorithm_selector.js";

const TWEEN = window.TWEEN;

class MazeApp {
  constructor() {
    this.algorithmSelector = new AlgorithmSelector();
    this.algorithmSelector.createSelector(); // Crea el selector pero permanece oculto
    this.setupConfigLoader();
  }

  setupConfigLoader() {
    ConfigLoader.setupListeners(async (config) => {
      try {
        // Esperar un momento antes de hacer la transición
        await new Promise((resolve) => setTimeout(resolve, 300));

        // Ocultar el loader del JSON
        document.getElementById("loader-container").style.display = "none";

        // Guardar la configuración
        this.config = config;

        // Mostrar el selector de algoritmo
        this.algorithmSelector.show();

        // Configurar el evento de selección
        this.algorithmSelector.onSelect((algorithm) => {
          console.log("Initializing app with algorithm:", algorithm); // Debug
          this.initApp(algorithm);
        });
      } catch (error) {
        console.error("Error in setup:", error);
      }
    });
  }

  async initApp(algorithmName) {
    console.log("Starting app initialization..."); // Debug

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
    document
      .getElementById("canvas-container")
      .appendChild(renderer.domElement);

    // Posición inicial de la cámara
    camera.position.set(7, 7, 7);
    camera.lookAt(0, 0, 0);

    // Crear el laberinto
    const mazeModel = new MazeModel(scene);
    await mazeModel.initialize(this.config);

    // Seleccionar e iniciar el algoritmo de búsqueda
    let pathFinder = this.createPathFinder(algorithmName, mazeModel);
    const path = pathFinder.findPath();

    // Crear e iniciar el robot
    const robotModel = new RobotModel(scene, mazeModel);
    if (path) {
      robotModel.followPath(path, 1000);
    }

    // Configurar controles
    const controls = new Controls(camera, renderer);

    // Configurar animación
    this.setupAnimation(renderer, scene, camera, controls);
  }

  createPathFinder(algorithmName, mazeModel) {
    switch (algorithmName) {
      case "bfs":
        return new PathFinderBFS(mazeModel.mazeConfig.config);
      case "dfs":
        return new PathFinderDFS(mazeModel.mazeConfig.config);
      case "astar":
        return new PathFinderAStar(mazeModel.mazeConfig.config);
      case "dijkstra":
        return new PathFinderDijkstra(mazeModel.mazeConfig.config);
      default:
        return new PathFinderBFS(mazeModel.mazeConfig.config);
    }
  }

  setupAnimation(renderer, scene, camera, controls) {
    function animate() {
      requestAnimationFrame(animate);
      TWEEN.update();
      controls.update();
      renderer.render(scene, camera);
    }

    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    animate();
  }
}

// Iniciar la aplicación
new MazeApp();
