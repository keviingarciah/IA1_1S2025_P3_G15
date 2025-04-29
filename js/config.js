export class ConfigLoader {
  static async loadMazeConfig(file) {
    try {
      const content = await file.text();
      const config = JSON.parse(content);
      this.validateMazeConfig(config);
      return config;
    } catch (error) {
      throw new Error(`Error loading configuration: ${error.message}`);
    }
  }

  static validateMazeConfig(config) {
    const requiredFields = ["ancho", "alto", "inicio", "fin", "paredes"];

    for (const field of requiredFields) {
      if (!(field in config)) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    if (!Number.isInteger(config.ancho) || config.ancho <= 0) {
      throw new Error("Width must be a positive integer");
    }
    if (!Number.isInteger(config.alto) || config.alto <= 0) {
      throw new Error("Height must be a positive integer");
    }
    if (!Array.isArray(config.inicio) || config.inicio.length !== 2) {
      throw new Error("Start position must be an array of two numbers");
    }
    if (!Array.isArray(config.fin) || config.fin.length !== 2) {
      throw new Error("End position must be an array of two numbers");
    }
    if (!Array.isArray(config.paredes)) {
      throw new Error("Walls must be an array");
    }

    return true;
  }

  static setupListeners(onLoadSuccess) {
    const input = document.getElementById("json-input");
    const errorMessage = document.getElementById("error-message");

    input.addEventListener("change", async (event) => {
      const file = event.target.files[0];

      if (file) {
        try {
          const config = await this.loadMazeConfig(file);
          onLoadSuccess(config);
        } catch (error) {
          errorMessage.textContent = error.message;
          errorMessage.style.display = "block";
          event.target.value = "";
        }
      }
    });
  }
}
