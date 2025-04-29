export class RobotModel {
  constructor(scene, mazeModel) {
    this.scene = scene;
    this.mazeModel = mazeModel;
    this.robotSize = 0.6; // Más pequeño que el tamaño de la celda
    this.robotHeight = 0.8;
    this.createRobot();
  }

  createRobot() {
    this.robotGroup = new THREE.Group();

    // Cuerpo principal
    const bodyGeometry = new THREE.BoxGeometry(
      this.robotSize,
      this.robotHeight * 0.6,
      this.robotSize
    );
    const bodyMaterial = new THREE.MeshPhongMaterial({
      color: 0x4285f4,
      specular: 0x404040,
      shininess: 30,
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);

    // Cabeza más detallada
    const headGeometry = new THREE.BoxGeometry(
      this.robotSize * 0.8,
      this.robotSize * 0.6,
      this.robotSize * 0.7
    );
    const headMaterial = new THREE.MeshPhongMaterial({
      color: 0x34a853,
      specular: 0x404040,
      shininess: 30,
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = this.robotHeight * 0.4;

    // Antenas
    const antennaGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.2);
    const antennaMaterial = new THREE.MeshPhongMaterial({ color: 0xcccccc });

    const leftAntenna = new THREE.Mesh(antennaGeometry, antennaMaterial);
    leftAntenna.position.set(-0.15, this.robotHeight * 0.7, 0);

    const rightAntenna = new THREE.Mesh(antennaGeometry, antennaMaterial);
    rightAntenna.position.set(0.15, this.robotHeight * 0.7, 0);

    // Ojos más elaborados
    const eyeGeometry = new THREE.SphereGeometry(0.08, 16, 16);
    const eyeMaterial = new THREE.MeshPhongMaterial({
      color: 0x00ff00,
      emissive: 0x00ff00,
      emissiveIntensity: 0.5,
    });

    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.15, this.robotHeight * 0.4, 0.3);

    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.15, this.robotHeight * 0.4, 0.3);

    // Brazos
    const armGeometry = new THREE.BoxGeometry(0.1, 0.3, 0.1);
    const armMaterial = new THREE.MeshPhongMaterial({ color: 0x4285f4 });

    const leftArm = new THREE.Mesh(armGeometry, armMaterial);
    leftArm.position.set(-0.35, 0.1, 0);

    const rightArm = new THREE.Mesh(armGeometry, armMaterial);
    rightArm.position.set(0.35, 0.1, 0);

    // Piernas
    const legGeometry = new THREE.BoxGeometry(0.15, 0.2, 0.15);
    const legMaterial = new THREE.MeshPhongMaterial({ color: 0x34a853 });

    const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
    leftLeg.position.set(-0.2, -0.3, 0);

    const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
    rightLeg.position.set(0.2, -0.3, 0);

    // Panel en el pecho
    const panelGeometry = new THREE.PlaneGeometry(0.3, 0.2);
    const panelMaterial = new THREE.MeshPhongMaterial({
      color: 0x000000,
      emissive: 0x666666,
      side: THREE.DoubleSide,
    });
    const panel = new THREE.Mesh(panelGeometry, panelMaterial);
    panel.position.set(0, 0.1, this.robotSize / 2 + 0.01);
    panel.rotation.x = Math.PI;

    // Añadir todas las partes al grupo
    this.robotGroup.add(body);
    this.robotGroup.add(head);
    this.robotGroup.add(leftAntenna);
    this.robotGroup.add(rightAntenna);
    this.robotGroup.add(leftEye);
    this.robotGroup.add(rightEye);
    this.robotGroup.add(leftArm);
    this.robotGroup.add(rightArm);
    this.robotGroup.add(leftLeg);
    this.robotGroup.add(rightLeg);
    this.robotGroup.add(panel);

    this.moveToStart();
    this.scene.add(this.robotGroup);
  }

  moveToStart() {
    const startX = this.mazeModel.mazeConfig.config.inicio[0];
    const startZ = this.mazeModel.mazeConfig.config.inicio[1];

    this.robotGroup.position.set(
      startX * this.mazeModel.wallSize -
        (this.mazeModel.width * this.mazeModel.wallSize) / 2,
      this.robotHeight / 2,
      startZ * this.mazeModel.wallSize -
        (this.mazeModel.height * this.mazeModel.wallSize) / 2
    );
  }

  // Método para mover el robot a una nueva posición
  moveTo(x, z) {
    this.robotGroup.position.x =
      x * this.mazeModel.wallSize -
      (this.mazeModel.width * this.mazeModel.wallSize) / 2;
    this.robotGroup.position.z =
      z * this.mazeModel.wallSize -
      (this.mazeModel.height * this.mazeModel.wallSize) / 2;
  }

  // Método para rotar el robot
  rotate(angle) {
    this.robotGroup.rotation.y = angle;
  }

  async followPath(path, delay = 1000) {
    for (let i = 0; i < path.length; i++) {
      const [x, z] = path[i];
      // Calcular la rotación antes de mover
      if (i < path.length - 1) {
        const [nextX, nextZ] = path[i + 1];
        const angle = Math.atan2(nextX - x, nextZ - z);
        this.robotGroup.rotation.y = angle;
      }

      // Calcular la posición en el mundo
      const worldX =
        x * this.mazeModel.wallSize -
        (this.mazeModel.width * this.mazeModel.wallSize) / 2;
      const worldZ =
        z * this.mazeModel.wallSize -
        (this.mazeModel.height * this.mazeModel.wallSize) / 2;

      // Animar el movimiento
      await new Promise((resolve) => {
        const startPos = {
          x: this.robotGroup.position.x,
          z: this.robotGroup.position.z,
        };

        const animation = new TWEEN.Tween(startPos)
          .to({ x: worldX, z: worldZ }, delay)
          .easing(TWEEN.Easing.Quadratic.InOut)
          .onUpdate(() => {
            this.robotGroup.position.x = startPos.x;
            this.robotGroup.position.z = startPos.z;
          })
          .onComplete(resolve)
          .start();
      });
    }
  }
}
