import { MazeModel } from "./maze_model.js";
import { Controls } from "./controls.js";
import { RobotModel } from "./robot_model.js";
import { PathFinderBFS } from "./pathfinder_bfs.js";
import { PathFinderDFS } from "./pathfinder_dfs.js";
import { PathFinderAStar } from "./pathfinder_astar.js";
import { PathFinderDijkstra } from "./pathfinder_dijkstra.js";
import { ConfigLoader } from "./config_loader.js";
import { AlgorithmSelector } from "./algorithm_selector.js";
import { SimulationMenu } from "./simulation_menu.js";

const TWEEN = window.TWEEN;

class MazeApp {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.currentRobot = null;
    this.currentPath = null;
    this.mazeModel = null;
    this.config = null;

    this.algorithmSelector = new AlgorithmSelector();
    this.algorithmSelector.createSelector();
    this.setupConfigLoader();
    this.setupSimulationMenu();
  }

  setupConfigLoader() {
    ConfigLoader.setupListeners(async (config) => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 300));
        document.getElementById("loader-container").style.display = "none";
        this.config = config;
        this.algorithmSelector.show();
        this.algorithmSelector.onSelect((algorithm) => {
          console.log("Initializing app with algorithm:", algorithm);
          this.initApp(algorithm);
        });
      } catch (error) {
        console.error("Error in setup:", error);
      }
    });
  }

  setupSimulationMenu() {
    this.simulationMenu = new SimulationMenu(
      () => this.restartSimulation(),
      () => this.selectNewAlgorithm(),
      () => this.resetSimulation()
    );
    this.simulationMenu.createMenu();
  }

  restartSimulation() {
    if (this.currentRobot && this.currentPath) {
      this.simulationMenu.hide();
      this.currentRobot.followPath(this.currentPath, 1000).then(() => {
        setTimeout(() => this.simulationMenu.show(), 1000);
      });
    }
  }

  selectNewAlgorithm() {
    // Limpiar solo lo necesario sin destruir la escena
    if (this.currentRobot) {
      this.scene.remove(this.currentRobot.robotGroup);
      this.currentRobot = null;
    }
    this.currentPath = null;

    // Ocultar menú y mostrar selector
    this.simulationMenu.hide();
    this.algorithmSelector.show();

    // Configurar selección de nuevo algoritmo
    this.algorithmSelector.onSelect((algorithm) => {
      console.log("Restarting with new algorithm:", algorithm);
      // No llamar a cleanup() aquí, solo reiniciar la simulación
      this.initApp(algorithm);
    });
  }

  resetSimulation() {
    // Asegurarse de que todos los elementos estén ocultos antes de recargar
    this.simulationMenu.hide();
    this.algorithmSelector.hide();
    document.getElementById("canvas-container").style.display = "none";

    // Mostrar el loader
    const loader = document.getElementById("loader-container");
    if (loader) {
      loader.style.display = "flex";
    }

    // Pequeño delay antes de recargar para asegurar que la UI se actualice
    setTimeout(() => {
      window.location.reload();
    }, 100);
  }

  cleanup() {
    if (this.scene) {
      while (this.scene.children.length > 0) {
        const object = this.scene.children[0];
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose());
          } else {
            object.material.dispose();
          }
        }
        this.scene.remove(object);
      }
    }

    if (this.renderer) {
      this.renderer.dispose();
      this.renderer.forceContextLoss();
      const canvas = this.renderer.domElement;
      if (canvas && canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
    }

    // Remove controls event listeners instead of trying to dispose
    if (this.controls) {
      this.controls.enabled = false;
      this.controls = null;
    }

    this.currentRobot = null;
    this.currentPath = null;
    this.mazeModel = null;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
  }

  async initApp(algorithmName) {
    console.log("Starting app initialization...");
    this.cleanup();

    document.getElementById("canvas-container").style.display = "block";

    // Configuración inicial
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x808080);

    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    document
      .getElementById("canvas-container")
      .appendChild(this.renderer.domElement);

    // Posición inicial de la cámara
    this.camera.position.set(7, 7, 7);
    this.camera.lookAt(0, 0, 0);

    // Crear el laberinto
    this.mazeModel = new MazeModel(this.scene);
    await this.mazeModel.initialize(this.config);

    // Seleccionar e iniciar el algoritmo de búsqueda
    let pathFinder = this.createPathFinder(algorithmName, this.mazeModel);
    this.currentPath = pathFinder.findPath();

    // Crear e iniciar el robot
    this.currentRobot = new RobotModel(this.scene, this.mazeModel);
    if (this.currentPath) {
      this.currentRobot.followPath(this.currentPath, 1000).then(() => {
        setTimeout(() => this.simulationMenu.show(), 1000);
      });
    }

    // Configurar controles
    this.controls = new Controls(this.camera, this.renderer);

    // Configurar animación
    this.setupAnimation();
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

  setupAnimation() {
    const animate = () => {
      requestAnimationFrame(animate);
      TWEEN.update();
      if (this.controls) this.controls.update();
      if (this.renderer && this.scene && this.camera) {
        this.renderer.render(this.scene, this.camera);
      }
    };

    window.addEventListener("resize", () => {
      if (this.camera && this.renderer) {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
      }
    });

    animate();
  }
}

// Iniciar la aplicación
new MazeApp();
