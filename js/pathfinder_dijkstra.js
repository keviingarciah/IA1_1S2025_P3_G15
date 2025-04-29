export class PathFinderDijkstra {
  constructor(mazeConfig) {
    this.width = mazeConfig.ancho;
    this.height = mazeConfig.alto;
    this.walls = mazeConfig.paredes;
    this.start = mazeConfig.inicio;
    this.end = mazeConfig.fin;
  }

  isWall(x, y) {
    return this.walls.some((wall) => wall[0] === x && wall[1] === y);
  }

  getNeighbors(x, y) {
    const directions = [
      [0, 1], // norte
      [1, 0], // este
      [0, -1], // sur
      [-1, 0], // oeste
      [1, 1], // noreste
      [-1, 1], // noroeste
      [1, -1], // sureste
      [-1, -1], // suroeste
    ];

    return directions
      .map(([dx, dy]) => {
        const newX = x + dx;
        const newY = y + dy;
        const isDiagonal = Math.abs(dx) + Math.abs(dy) === 2;
        return {
          pos: [newX, newY],
          cost: isDiagonal ? 1.4 : 1, // Costo mayor para movimientos diagonales
        };
      })
      .filter(
        ({ pos }) =>
          pos[0] >= 0 &&
          pos[0] < this.width &&
          pos[1] >= 0 &&
          pos[1] < this.height &&
          !this.isWall(pos[0], pos[1])
      );
  }

  findPath() {
    console.log(
      "%c Iniciando búsqueda Dijkstra...",
      "color: #4CAF50; font-weight: bold"
    );

    // Inicializar estructuras
    const distances = new Map();
    const previous = new Map();
    const unvisited = new Set();

    // Inicializar distancias
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        const pos = `${x},${y}`;
        distances.set(pos, Infinity);
        unvisited.add(pos);
      }
    }

    // Establecer distancia inicial
    distances.set(`${this.start[0]},${this.start[1]}`, 0);

    while (unvisited.size > 0) {
      // Encontrar el nodo no visitado con menor distancia
      let current = Array.from(unvisited).reduce((a, b) =>
        distances.get(a) < distances.get(b) ? a : b
      );

      const [currentX, currentY] = current.split(",").map(Number);
      console.log(
        `%c Explorando nodo: (${currentX}, ${currentY})`,
        "color: #2196F3"
      );

      // Si llegamos al final
      if (currentX === this.end[0] && currentY === this.end[1]) {
        console.log(
          "%c ¡Camino encontrado!",
          "color: #4CAF50; font-weight: bold"
        );
        return this.reconstructPath(previous);
      }

      unvisited.delete(current);
      const currentDist = distances.get(current);

      // Explorar vecinos
      for (const {
        pos: [x, y],
        cost,
      } of this.getNeighbors(currentX, currentY)) {
        if (!unvisited.has(`${x},${y}`)) continue;

        const newDist = currentDist + cost;
        const neighborKey = `${x},${y}`;

        if (newDist < distances.get(neighborKey)) {
          distances.set(neighborKey, newDist);
          previous.set(neighborKey, [currentX, currentY]);
        }
      }
    }

    console.log(
      "%c No se encontró camino",
      "color: #f44336; font-weight: bold"
    );
    return null;
  }

  reconstructPath(previous) {
    const path = [];
    let current = this.end;

    while (current) {
      path.unshift(current);
      const key = `${current[0]},${current[1]}`;
      current = previous.get(key);
    }

    this.logPath(path);
    return path;
  }

  logPath(path) {
    console.log("%c Camino encontrado:", "color: #4CAF50; font-weight: bold");
    path.forEach((pos, index) => {
      console.log(
        `%c Paso ${index + 1}: (${pos[0]}, ${pos[1]})`,
        "color: #9C27B0"
      );
    });

    // Visualización ASCII del laberinto
    const grid = Array(this.height)
      .fill()
      .map(() => Array(this.width).fill("·"));

    this.walls.forEach(([x, y]) => {
      grid[y][x] = "█";
    });

    path.forEach(([x, y], index) => {
      if (index === 0) grid[y][x] = "S";
      else if (index === path.length - 1) grid[y][x] = "E";
      else grid[y][x] = "●";
    });

    console.log(
      "%c Visualización del laberinto:",
      "color: #4CAF50; font-weight: bold"
    );
    const mazeString = grid
      .reverse()
      .map((row) => row.join(" "))
      .join("\n");
    console.log(`%c${mazeString}`, "font-family: monospace; font-size: 14px");
  }
}
