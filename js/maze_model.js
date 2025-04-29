import { MazeConfig } from "./maze_config.js";

export class MazeModel {
  constructor(scene) {
    this.scene = scene;
    this.mazeConfig = new MazeConfig();
    this.wallSize = 1;
    this.wallHeight = 0.5;
    this.setupLights(scene);
  }

  async initialize(configPath) {
    await this.mazeConfig.loadConfig(configPath);
    this.width = this.mazeConfig.config.ancho;
    this.height = this.mazeConfig.config.alto;
    this.maze = this.createMaze();
  }

  createMaze() {
    // Material para las paredes
    const wallMaterial = new THREE.MeshPhongMaterial({
      color: 0x808080,
      specular: 0x404040,
      shininess: 30,
    });

    const wallGeometry = new THREE.BoxGeometry(
      this.wallSize,
      this.wallHeight,
      this.wallSize
    );

    this.mazeGroup = new THREE.Group();

    // Crear el laberinto según la configuración - solo paredes
    for (let x = -1; x <= this.width; x++) {
      for (let z = -1; z <= this.height; z++) {
        // Si es borde o es una pared del laberinto
        if (
          x === -1 ||
          x === this.width ||
          z === -1 ||
          z === this.height ||
          this.mazeConfig.hasWall(x, z)
        ) {
          const cell = new THREE.Mesh(wallGeometry, wallMaterial);
          cell.position.set(
            x * this.wallSize - (this.width * this.wallSize) / 2,
            0,
            z * this.wallSize - (this.height * this.wallSize) / 2
          );
          this.mazeGroup.add(cell);
        }
      }
    }

    // Crear el suelo como una cuadrícula de tiles (incluyendo el borde)
    for (let x = -1; x <= this.width; x++) {
      for (let z = -1; z <= this.height; z++) {
        const tileGeometry = new THREE.PlaneGeometry(
          this.wallSize,
          this.wallSize
        );
        let tileMaterial;

        // Solo aplicar colores especiales dentro del laberinto real
        if (x >= 0 && x < this.width && z >= 0 && z < this.height) {
          if (this.mazeConfig.isStart(x, z)) {
            tileMaterial = new THREE.MeshPhongMaterial({
              color: 0x00ff00,
              side: THREE.DoubleSide,
            });
          } else if (this.mazeConfig.isEnd(x, z)) {
            tileMaterial = new THREE.MeshPhongMaterial({
              color: 0xff0000,
              side: THREE.DoubleSide,
            });
          } else {
            tileMaterial = new THREE.MeshPhongMaterial({
              color: 0x404040,
              side: THREE.DoubleSide,
            });
          }
        } else {
          // Color para el borde del suelo
          tileMaterial = new THREE.MeshPhongMaterial({
            color: 0x303030,
            side: THREE.DoubleSide,
          });
        }

        const tile = new THREE.Mesh(tileGeometry, tileMaterial);
        tile.rotation.x = Math.PI / 2;
        tile.position.set(
          x * this.wallSize - (this.width * this.wallSize) / 2,
          -this.wallHeight / 2,
          z * this.wallSize - (this.height * this.wallSize) / 2
        );
        this.mazeGroup.add(tile);
      }
    }

    this.scene.add(this.mazeGroup);
    return this.mazeGroup;
  }

  setupLights(scene) {
    // Luz direccional principal
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Luz ambiental más intensa
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    // Luz hemisférica para mejor iluminación general
    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x404040, 0.6);
    scene.add(hemisphereLight);
  }

  rotate(deltaX, deltaY) {
    this.mazeGroup.rotation.y += deltaX * 0.01;
    this.mazeGroup.rotation.x += deltaY * 0.01;
  }

  // Método para actualizar dimensiones
  updateDimensions(newWidth, newHeight) {
    this.width = newWidth;
    this.height = newHeight;

    // Eliminar el laberinto anterior
    this.scene.remove(this.mazeGroup);

    // Crear nuevo laberinto
    this.maze = this.createMaze();
  }
}
