export class PathFinderDFS {
  constructor(mazeConfig) {
    this.width = mazeConfig.ancho;
    this.height = mazeConfig.alto;
    this.walls = mazeConfig.paredes;
    this.start = mazeConfig.inicio;
    this.end = mazeConfig.fin;
    this.visited = new Set();
  }

  isWall(x, y) {
    return this.walls.some((wall) => wall[0] === x && wall[1] === y);
  }

  getNeighbors(x, y) {
    const directions = [
      [0, 1], // arriba
      [1, 0], // derecha
      [0, -1], // abajo
      [-1, 0], // izquierda
    ];

    return directions
      .map(([dx, dy]) => [x + dx, y + dy])
      .filter(
        ([newX, newY]) =>
          newX >= 0 &&
          newX < this.width &&
          newY >= 0 &&
          newY < this.height &&
          !this.isWall(newX, newY) &&
          !this.visited.has(`${newX},${newY}`)
      );
  }

  dfs(currentPos, path = []) {
    const [x, y] = currentPos;
    const posKey = `${x},${y}`;

    console.log(`%c Explorando nodo: (${x}, ${y})`, "color: #2196F3");

    if (x === this.end[0] && y === this.end[1]) {
      console.log(
        "%c ¡Camino encontrado!",
        "color: #4CAF50; font-weight: bold"
      );
      return [...path, currentPos];
    }

    this.visited.add(posKey);

    for (const nextPos of this.getNeighbors(x, y)) {
      const result = this.dfs(nextPos, [...path, currentPos]);
      if (result) return result;
    }

    return null;
  }

  findPath() {
    console.log(
      "%c Iniciando búsqueda DFS...",
      "color: #4CAF50; font-weight: bold"
    );

    const path = this.dfs(this.start);

    if (path) {
      this.logPath(path);
      return path;
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
