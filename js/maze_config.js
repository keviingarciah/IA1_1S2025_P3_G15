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

  async loadConfig(jsonContent) {
    try {
      // Ahora recibimos directamente el contenido del JSON
      this.config = {
        ancho: jsonContent.ancho,
        alto: jsonContent.alto,
        inicio: jsonContent.inicio,
        fin: jsonContent.fin,
        paredes: jsonContent.paredes,
      };

      return true;
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
