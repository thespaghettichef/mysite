import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

// Create a flat floor instead of a cube (50x0.1x50 for width, height, depth)
const geometry = new THREE.BoxGeometry(50, 0.1, 50);
const material = new THREE.MeshBasicMaterial({ color: 0x8B0000 });
const floor = new THREE.Mesh(geometry, material);
floor.position.y = -1; // Lower it slightly below camera
scene.add(floor);

// Position camera above the floor
camera.position.set(0, 2, 5);
camera.lookAt(0, 0, 0);

// Basic movement controls
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
const velocity = new THREE.Vector3();
const speed = 0.05;

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
    // Movement logic
    velocity.z = 0;
    velocity.x = 0;

    if (moveForward) velocity.z = -speed;
    if (moveBackward) velocity.z = speed;
    if (moveLeft) velocity.x = -speed;
    if (moveRight) velocity.x = speed;

    camera.position.add(velocity);

    // Keep camera at consistent height
    camera.position.y = 2;

    renderer.render(scene, camera);
}