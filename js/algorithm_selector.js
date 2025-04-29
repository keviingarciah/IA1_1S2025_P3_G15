export class AlgorithmSelector {
  constructor() {
    this.algorithms = [
      { id: "bfs", name: "Breadth-First Search" },
      { id: "dfs", name: "Depth-First Search" },
      { id: "astar", name: "A* Search" },
      { id: "dijkstra", name: "Dijkstra's Algorithm" },
    ];
    this.container = null;
    this.callback = null;
  }

  createSelector() {
    this.container = document.createElement("div");
    this.container.id = "algorithm-selector";
    this.container.className = "loader-overlay";
    this.container.style.display = "none";

    const content = document.createElement("div");
    content.className = "loader-content";

    content.innerHTML = `
            <h2>Select Algorithm</h2>
            <select id="algorithm-select" class="algorithm-select">
                ${this.algorithms
                  .map(
                    (algo) => `<option value="${algo.id}">${algo.name}</option>`
                  )
                  .join("")}
            </select>
            <button id="start-button" class="start-button">Start Simulation</button>
        `;

    this.container.appendChild(content);
    document.body.appendChild(this.container);

    // Añadir el event listener inmediatamente después de crear el botón
    this.setupEventListener();
  }

  setupEventListener() {
    const startButton = this.container.querySelector("#start-button");
    const selectElement = this.container.querySelector("#algorithm-select");

    if (startButton && selectElement) {
      startButton.addEventListener("click", () => {
        console.log("Button clicked"); // Debug
        const selectedAlgorithm = selectElement.value;
        console.log("Selected algorithm:", selectedAlgorithm); // Debug

        if (this.callback) {
          this.hide();
          this.callback(selectedAlgorithm);
        } else {
          console.error("No callback function set");
        }
      });
    } else {
      console.error("Required elements not found");
    }
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

  onSelect(callback) {
    this.callback = callback;
  }
}
