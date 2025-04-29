export class MazeConfig {
  constructor() {
    this.config = {
      ancho: 0,
      alto: 0,
      inicio: [0, 0],
      fin: [0, 0],
      paredes: [],
    };
  }

  async loadConfig(jsonPath) {
    try {
      const response = await fetch(jsonPath);
      const newConfig = await response.json();

      // Actualizar toda la configuración
      this.config = {
        ancho: newConfig.ancho,
        alto: newConfig.alto,
        inicio: newConfig.inicio,
        fin: newConfig.fin,
        paredes: newConfig.paredes,
      };

      return true; // Indicar que la carga fue exitosa
    } catch (error) {
      console.error("Error loading maze configuration:", error);
      return false;
    }
  }

  hasWall(x, z) {
    return this.config.paredes.some((wall) => wall[0] === x && wall[1] === z);
  }

  isStart(x, z) {
    return this.config.inicio[0] === x && this.config.inicio[1] === z;
  }

  isEnd(x, z) {
    return this.config.fin[0] === x && this.config.fin[1] === z;
  }
}
