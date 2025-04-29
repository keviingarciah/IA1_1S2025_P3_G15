export class PathFinderAStar {
  constructor(mazeConfig) {
    this.width = mazeConfig.ancho;
    this.height = mazeConfig.alto;
    this.walls = mazeConfig.paredes;
    this.start = mazeConfig.inicio;
    this.end = mazeConfig.fin;
  }

  // Heurística: Distancia Manhattan
  heuristic(pos) {
    return Math.abs(pos[0] - this.end[0]) + Math.abs(pos[1] - this.end[1]);
  }

  isWall(x, y) {
    return this.walls.some((wall) => wall[0] === x && wall[1] === y);
  }

  getNeighbors(x, y) {
    const directions = [
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, 0], // Movimientos cardinales
      [1, 1],
      [-1, 1],
      [1, -1],
      [-1, -1], // Movimientos diagonales
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
      "%c Iniciando búsqueda A*...",
      "color: #4CAF50; font-weight: bold"
    );

    const openSet = new Map();
    const closedSet = new Map();
    const start = this.start;

    // Inicializar nodo inicial
    openSet.set(start.toString(), {
      pos: start,
      g: 0,
      h: this.heuristic(start),
      f: this.heuristic(start),
      parent: null,
    });

    while (openSet.size > 0) {
      // Encontrar nodo con menor f en openSet
      let current = Array.from(openSet.values()).reduce((a, b) =>
        a.f < b.f ? a : b
      );
      let [currentX, currentY] = current.pos;

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
        return this.reconstructPath(current);
      }

      // Mover current de openSet a closedSet
      openSet.delete(current.pos.toString());
      closedSet.set(current.pos.toString(), current);

      // Revisar vecinos
      for (const neighborPos of this.getNeighbors(currentX, currentY)) {
        const neighborKey = neighborPos.toString();

        // Saltar si ya está en closedSet
        if (closedSet.has(neighborKey)) continue;

        // Calcular g tentativo (costo desde inicio)
        const isDiagonal =
          Math.abs(neighborPos[0] - currentX) +
            Math.abs(neighborPos[1] - currentY) ===
          2;
        const movementCost = isDiagonal ? 1.4 : 1;
        const tentativeG = current.g + movementCost;

        let neighbor = openSet.get(neighborKey);
        let isNewNode = false;

        if (!neighbor) {
          neighbor = {
            pos: neighborPos,
            g: Infinity,
            h: this.heuristic(neighborPos),
            f: Infinity,
            parent: null,
          };
          isNewNode = true;
        }

        if (tentativeG < neighbor.g) {
          neighbor.parent = current;
          neighbor.g = tentativeG;
          neighbor.f = neighbor.g + neighbor.h;

          if (isNewNode) {
            openSet.set(neighborKey, neighbor);
          }
        }
      }
    }

    console.log(
      "%c No se encontró camino",
      "color: #f44336; font-weight: bold"
    );
    return null;
  }

  reconstructPath(endNode) {
    const path = [];
    let current = endNode;

    while (current) {
      path.unshift(current.pos);
      current = current.parent;
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
