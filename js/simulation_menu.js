export class SimulationMenu {
  constructor(onRestart, onNewAlgorithm, onNewMaze) {
    this.container = null;
    this.callbacks = {
      restart: onRestart,
      newAlgorithm: onNewAlgorithm,
      newMaze: onNewMaze,
    };
  }

  createMenu() {
    this.container = document.createElement("div");
    this.container.id = "simulation-menu";
    this.container.className = "simulation-menu";
    this.container.style.display = "none";

    const content = document.createElement("div");
    content.className = "menu-content";
    content.innerHTML = `
            <h2>¡SIMULACIÓN COMPLETADA!</h2>
            <div class="menu-buttons">
                <button id="restart-btn" class="menu-button">Reiniciar animación</button>
                <button id="algorithm-btn" class="menu-button">intentar otro algoritmo</button>
                <button id="maze-btn" class="menu-button">Cargar nuevo laberinto</button>
            </div>
        `;

    this.container.appendChild(content);
    document.body.appendChild(this.container);
    this.setupEventListeners();
  }

  setupEventListeners() {
    const restartBtn = this.container.querySelector("#restart-btn");
    const algorithmBtn = this.container.querySelector("#algorithm-btn");
    const mazeBtn = this.container.querySelector("#maze-btn");

    restartBtn.addEventListener("click", () => {
      this.hide();
      this.callbacks.restart();
    });

    algorithmBtn.addEventListener("click", () => {
      this.hide();
      this.callbacks.newAlgorithm();
    });

    mazeBtn.addEventListener("click", () => {
      this.hide();
      this.callbacks.newMaze();
    });
  }

  show() {
    if (this.container) {
      this.container.style.display = "flex";
    }
  }

  hide() {
    if (this.container) {
      this.container.style.display = "none";
    }
  }
}
