export class PathFinderBFS {
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
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, 0],
    ];

    return directions
      .map(([dx, dy]) => [x + dx, y + dy])
      .filter(
        ([newX, newY]) =>
          newX >= 0 &&
          newX < this.width &&
          newY >= 0 &&
          newY < this.height &&
          !this.isWall(newX, newY)
      );
  }

  findPath() {
    console.log(
      "%c Iniciando búsqueda BFS...",
      "color: #4CAF50; font-weight: bold"
    );

    const queue = [[this.start]];
    const visited = new Set([`${this.start[0]},${this.start[1]}`]);

    while (queue.length > 0) {
      const path = queue.shift();
      const [currentX, currentY] = path[path.length - 1];

      console.log(
        `%c Explorando nodo: (${currentX}, ${currentY})`,
        "color: #2196F3"
      );

      if (currentX === this.end[0] && currentY === this.end[1]) {
        console.log(
          "%c ¡Camino encontrado!",
          "color: #4CAF50; font-weight: bold"
        );
        this.logPath(path);
        return path;
      }

      for (const [nextX, nextY] of this.getNeighbors(currentX, currentY)) {
        const key = `${nextX},${nextY}`;
        if (!visited.has(key)) {
          visited.add(key);
          queue.push([...path, [nextX, nextY]]);
        }
      }
    }

    console.log(
      "%c No se encontró camino",
      "color: #f44336; font-weight: bold"
    );
    return null;
  }

  logPath(path) {
    console.log("%c Camino encontrado:", "color: #4CAF50; font-weight: bold");
    path.forEach((pos, index) => {
      console.log(
        `%c Paso ${index + 1}: (${pos[0]}, ${pos[1]})`,
        "color: #9C27B0"
      );
    });

    // Crear visualización ASCII del laberinto
    const grid = Array(this.height)
      .fill()
      .map(() => Array(this.width).fill("·"));

    // Marcar paredes
    this.walls.forEach(([x, y]) => {
      grid[y][x] = "█";
    });

    // Marcar camino
    path.forEach(([x, y], index) => {
      if (index === 0) grid[y][x] = "S";
      else if (index === path.length - 1) grid[y][x] = "E";
      else grid[y][x] = "●";
    });

    // Imprimir laberinto
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
