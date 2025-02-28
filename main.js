import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xB0E0E6); // sky color (background)
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

// Create floor
const geometry = new THREE.BoxGeometry(50, 0.1, 50);
const material = new THREE.MeshBasicMaterial({ color: 0x228B22 });
const floor = new THREE.Mesh(geometry, material);
floor.position.y = -1;
scene.add(floor);

// Camera setup
camera.position.set(0, 2, 5);

// Movement controls
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
const velocity = new THREE.Vector3();
const speed = 0.10;

// Mouse look variables
let isLocked = false;
const euler = new THREE.Euler(0, 0, 0, 'YXZ');
const PI_2 = Math.PI / 2;

// Click to lock pointer
document.body.addEventListener('click', () => {
    document.body.requestPointerLock();
});

document.addEventListener('pointerlockchange', () => {
    isLocked = document.pointerLockElement === document.body;
});

document.addEventListener('mousemove', (event) => {
    if (!isLocked) return;

    const movementX = event.movementX || 0;
    const movementY = event.movementY || 0;

    euler.setFromQuaternion(camera.quaternion);

    euler.y -= movementX * 0.002;
    euler.x -= movementY * 0.002;
    euler.x = Math.max(-PI_2, Math.min(PI_2, euler.x)); // Clamp vertical rotation

    camera.quaternion.setFromEuler(euler);
});

// Keyboard controls
document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'w': moveForward = true; break;
        case 's': moveBackward = true; break;
        case 'a': moveLeft = true; break;
        case 'd': moveRight = true; break;
    }
});

document.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'w': moveForward = false; break;
        case 's': moveBackward = false; break;
        case 'a': moveLeft = false; break;
        case 'd': moveRight = false; break;
    }
});

function animate() {
    if (isLocked) {
        // Calculate direction based on camera rotation
        const direction = new THREE.Vector3(0, 0, -1);
        direction.applyQuaternion(camera.quaternion);
        direction.y = 0;
        direction.normalize();

        const sideways = new THREE.Vector3();
        sideways.crossVectors(direction, new THREE.Vector3(0, 1, 0)).normalize();

        velocity.set(0, 0, 0);
        
        if (moveForward) velocity.add(direction.multiplyScalar(speed));
        if (moveBackward) velocity.add(direction.multiplyScalar(-speed));
        if (moveLeft) velocity.add(sideways.multiplyScalar(-speed));
        if (moveRight) velocity.add(sideways.multiplyScalar(speed));

        camera.position.add(velocity);
        camera.position.y = 2; // Maintain height
    }

    renderer.render(scene, camera);
}

// Initial render
renderer.render(scene, camera);