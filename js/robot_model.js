export class RobotModel {
  constructor(scene, mazeModel) {
    this.scene = scene;
    this.mazeModel = mazeModel;
    this.robotSize = 0.6;
    this.robotHeight = 0.8;
    this.animationMixers = [];
    this.createRobot();
    this.setupLights();
  }

  createRobot() {
    this.robotGroup = new THREE.Group();

    // Cuerpo principal mejorado
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

    // Cabeza con detalles adicionales
    const headGroup = new THREE.Group();
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
    headGroup.add(head);
    headGroup.position.y = this.robotHeight * 0.4;

    // Sistema de articulaciones mejorado
    this.joints = {
      leftArm: new THREE.Group(),
      rightArm: new THREE.Group(),
      leftLeg: new THREE.Group(),
      rightLeg: new THREE.Group(),
      head: headGroup,
    };

    // Antenas animadas
    const antennaGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.2);
    const antennaMaterial = new THREE.MeshPhongMaterial({
      color: 0xcccccc,
      emissive: 0x666666,
    });

    this.antennas = {
      left: new THREE.Mesh(antennaGeometry, antennaMaterial),
      right: new THREE.Mesh(antennaGeometry, antennaMaterial),
    };

    this.antennas.left.position.set(-0.15, this.robotHeight * 0.7, 0);
    this.antennas.right.position.set(0.15, this.robotHeight * 0.7, 0);

    // Ojos con efectos de brillo
    const eyeGeometry = new THREE.SphereGeometry(0.08, 16, 16);
    const eyeMaterial = new THREE.MeshPhongMaterial({
      color: 0x00ff00,
      emissive: 0x00ff00,
      emissiveIntensity: 0.5,
    });

    this.eyes = {
      left: new THREE.Mesh(eyeGeometry, eyeMaterial),
      right: new THREE.Mesh(eyeGeometry, eyeMaterial),
    };

    this.eyes.left.position.set(-0.15, this.robotHeight * 0.4, 0.3);
    this.eyes.right.position.set(0.15, this.robotHeight * 0.4, 0.3);

    // Brazos articulados
    const armGeometry = new THREE.BoxGeometry(0.1, 0.3, 0.1);
    const armMaterial = new THREE.MeshPhongMaterial({
      color: 0x4285f4,
      specular: 0x404040,
    });

    const createArm = (isLeft) => {
      const arm = new THREE.Mesh(armGeometry, armMaterial);
      const joint = this.joints[isLeft ? "leftArm" : "rightArm"];
      joint.add(arm);
      arm.position.y = -0.15;
      joint.position.set(isLeft ? -0.35 : 0.35, 0.1, 0);
      return joint;
    };

    // Piernas articuladas
    const legGeometry = new THREE.BoxGeometry(0.15, 0.2, 0.15);
    const legMaterial = new THREE.MeshPhongMaterial({
      color: 0x34a853,
      specular: 0x404040,
    });

    const createLeg = (isLeft) => {
      const leg = new THREE.Mesh(legGeometry, legMaterial);
      const joint = this.joints[isLeft ? "leftLeg" : "rightLeg"];
      joint.add(leg);
      leg.position.y = -0.1;
      joint.position.set(isLeft ? -0.2 : 0.2, -0.3, 0);
      return joint;
    };

    // Jetpack y efectos
    const jetpackGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.3);
    const jetpackMaterial = new THREE.MeshPhongMaterial({
      color: 0x666666,
      specular: 0x404040,
    });
    this.jetpack = new THREE.Mesh(jetpackGeometry, jetpackMaterial);
    this.jetpack.position.set(0, 0, -0.25);

    // Efecto de propulsión
    this.createThruster();

    // Ensamblaje del robot
    this.robotGroup.add(body);
    this.robotGroup.add(this.joints.head);
    this.robotGroup.add(this.antennas.left);
    this.robotGroup.add(this.antennas.right);
    this.robotGroup.add(this.eyes.left);
    this.robotGroup.add(this.eyes.right);
    this.robotGroup.add(createArm(true));
    this.robotGroup.add(createArm(false));
    this.robotGroup.add(createLeg(true));
    this.robotGroup.add(createLeg(false));
    this.robotGroup.add(this.jetpack);
    this.robotGroup.add(this.thrusterEffect);

    this.moveToStart();
    this.scene.add(this.robotGroup);
  }

  createThruster() {
    const thrusterGeometry = new THREE.ConeGeometry(0.1, 0.2);
    const thrusterMaterial = new THREE.MeshPhongMaterial({
      color: 0xff3300,
      transparent: true,
      opacity: 0.7,
      emissive: 0xff3300,
    });
    this.thrusterEffect = new THREE.Mesh(thrusterGeometry, thrusterMaterial);
    this.thrusterEffect.position.set(0, -0.1, -0.25);
    this.thrusterEffect.rotation.x = Math.PI;
    this.thrusterEffect.visible = false;
  }

  setupLights() {
    // Luces para los ojos
    const leftEyeLight = new THREE.PointLight(0x00ff00, 1, 1);
    const rightEyeLight = new THREE.PointLight(0x00ff00, 1, 1);
    leftEyeLight.position.copy(this.eyes.left.position);
    rightEyeLight.position.copy(this.eyes.right.position);
    this.robotGroup.add(leftEyeLight);
    this.robotGroup.add(rightEyeLight);
  }

  async followPath(path, delay = 1000) {
    for (let i = 0; i < path.length; i++) {
      const [x, z] = path[i];

      // Rotación con anticipación
      if (i < path.length - 1) {
        const [nextX, nextZ] = path[i + 1];
        const angle = Math.atan2(nextX - x, nextZ - z);
        await this.animateRotation(angle, 300);
      }

      // Activar efectos de movimiento
      this.thrusterEffect.visible = true;
      this.startWalkAnimation();

      // Movimiento con efectos
      const worldX =
        x * this.mazeModel.wallSize -
        (this.mazeModel.width * this.mazeModel.wallSize) / 2;
      const worldZ =
        z * this.mazeModel.wallSize -
        (this.mazeModel.height * this.mazeModel.wallSize) / 2;

      await this.animateMovement(worldX, worldZ, delay);

      // Desactivar efectos
      this.thrusterEffect.visible = false;
      this.stopWalkAnimation();

      // Celebración al final
      if (i === path.length - 1) {
        await this.celebrateVictory();
      }
    }
  }

  startWalkAnimation() {
    this.walkAnimation = setInterval(() => {
      this.joints.leftArm.rotation.x = Math.sin(Date.now() * 0.01) * 0.5;
      this.joints.rightArm.rotation.x = -Math.sin(Date.now() * 0.01) * 0.5;
      this.joints.leftLeg.rotation.x = -Math.sin(Date.now() * 0.01) * 0.5;
      this.joints.rightLeg.rotation.x = Math.sin(Date.now() * 0.01) * 0.5;
    }, 16);
  }

  stopWalkAnimation() {
    clearInterval(this.walkAnimation);
    this.resetJoints();
  }

  resetJoints() {
    Object.values(this.joints).forEach((joint) => {
      joint.rotation.x = 0;
      joint.rotation.z = 0;
    });
  }

  async animateRotation(targetAngle, duration) {
    return new Promise((resolve) => {
      new TWEEN.Tween({ rotation: this.robotGroup.rotation.y })
        .to({ rotation: targetAngle }, duration)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onUpdate((obj) => (this.robotGroup.rotation.y = obj.rotation))
        .onComplete(resolve)
        .start();
    });
  }

  async animateMovement(worldX, worldZ, delay) {
    return new Promise((resolve) => {
      const startPos = {
        x: this.robotGroup.position.x,
        z: this.robotGroup.position.z,
        y: this.robotGroup.position.y,
      };

      new TWEEN.Tween(startPos)
        .to(
          {
            x: worldX,
            z: worldZ,
            y: this.robotHeight / 2 + Math.sin(Date.now() * 0.01) * 0.1,
          },
          delay
        )
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onUpdate(() => {
          this.robotGroup.position.set(startPos.x, startPos.y, startPos.z);
        })
        .onComplete(resolve)
        .start();
    });
  }

  async celebrateVictory() {
    const duration = 2000;
    const startTime = Date.now();

    return new Promise((resolve) => {
      const celebrate = () => {
        const progress = (Date.now() - startTime) / duration;

        if (progress < 1) {
          // Animación de victoria
          const jump = Math.abs(Math.sin(progress * Math.PI * 2));
          this.robotGroup.position.y = this.robotHeight / 2 + jump * 0.3;

          this.joints.leftArm.rotation.z =
            Math.sin(progress * Math.PI * 4) * 0.5;
          this.joints.rightArm.rotation.z =
            -Math.sin(progress * Math.PI * 4) * 0.5;

          requestAnimationFrame(celebrate);
        } else {
          this.resetJoints();
          resolve();
        }
      };

      celebrate();
    });
  }

  moveToStart() {
    // Calculate starting position based on maze configuration
    const startX = this.mazeModel.mazeConfig.config.inicio[0];
    const startZ = this.mazeModel.mazeConfig.config.inicio[1];

    // Convert maze coordinates to world coordinates
    const worldX =
      startX * this.mazeModel.wallSize -
      (this.mazeModel.width * this.mazeModel.wallSize) / 2;
    const worldZ =
      startZ * this.mazeModel.wallSize -
      (this.mazeModel.height * this.mazeModel.wallSize) / 2;

    // Position the robot at the start
    this.robotGroup.position.set(
      worldX,
      this.robotHeight / 2, // Lift robot to stand on the ground
      worldZ
    );
  }
}
