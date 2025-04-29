export class Controls {
  constructor(camera, renderer) {
    if (
      typeof THREE === "undefined" ||
      typeof THREE.OrbitControls === "undefined"
    ) {
      throw new Error("THREE.OrbitControls not loaded");
    }

    this.controls = new THREE.OrbitControls(camera, renderer.domElement);
    this.setupControls();
  }

  setupControls() {
    // Ajustar configuración para mejor control
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;

    this.controls.enableZoom = true;
    this.controls.zoomSpeed = 0.5; // Reduced for smoother zoom

    this.controls.enableRotate = true;
    this.controls.rotateSpeed = 0.5; // Reduced for better control

    this.controls.enablePan = true;
    this.controls.panSpeed = 0.8;

    // Ajustar límites
    this.controls.minDistance = 5;
    this.controls.maxDistance = 30;

    this.controls.minPolarAngle = 0;
    this.controls.maxPolarAngle = Math.PI / 2;

    // Prevent auto-rotation
    this.controls.autoRotate = false;

    // Add smooth stop
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
  }

  update() {
    this.controls.update();
  }
}
