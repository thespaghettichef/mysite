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
const material = new THREE.MeshPhongMaterial({ color: 0x228B22 }); // Already Phong for light
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

// Jumping variables
let jumpVelocity = 0;
const gravity = -0.02;
const jumpStrength = 0.3;
let isJumping = false;

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
    euler.x = Math.max(-PI_2, Math.min(PI_2, euler.x));

    camera.quaternion.setFromEuler(euler);
});

// Keyboard controls
document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'w': moveForward = true; break;
        case 's': moveBackward = true; break;
        case 'a': moveLeft = true; break;
        case 'd': moveRight = true; break;
        case ' ': 
            if (!isJumping) {
                jumpVelocity = jumpStrength;
                isJumping = true;
            }
            break;
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

// Sun with light
// --- START OF SUN SIZE/HEIGHT AMENDMENTS ---
const sunLight = new THREE.DirectionalLight(0xffffff, 1.5); // Brighter intensity
sunLight.position.set(10, 30, 10); // Higher up
scene.add(sunLight);

const sunGeometry = new THREE.SphereGeometry(2, 32, 32); // Bigger sun (radius 2)
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
sun.position.copy(sunLight.position);
scene.add(sun);
// --- END OF SUN SIZE/HEIGHT AMENDMENTS ---

// --- START OF PULSING CIRCLES AMENDMENTS ---
const ringPositions = [
    new THREE.Vector3(30, 10, 30),  // Outside floor corners
    new THREE.Vector3(-30, 10, 30),
    new THREE.Vector3(30, 10, -30),
    new THREE.Vector3(-30, 10, -30)
];

const rings = [];
const ringLights = [];

ringPositions.forEach((pos) => {
    // Ring geometry
    const ringGeometry = new THREE.RingGeometry(2, 3, 32); // Inner radius 2, outer 3
    const ringMaterial = new THREE.MeshBasicMaterial({ color: 0xaaaaaa, side: THREE.DoubleSide });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.position.copy(pos);
    ring.rotation.x = -Math.PI / 2; // Face downward
    scene.add(ring);
    rings.push(ring);

    // Downward light
    const spotLight = new THREE.SpotLight(0xffffff, 1, 50, Math.PI / 6, 0.5); // Narrow beam
    spotLight.position.copy(pos);
    spotLight.target.position.set(pos.x, -1, pos.z); // Aim at floor
    scene.add(spotLight);
    scene.add(spotLight.target);
    ringLights.push(spotLight);
});
// --- END OF PULSING CIRCLES AMENDMENTS ---

function animate() {
    if (isLocked) {
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

        // --- START OF INVISIBLE WALLS AMENDMENTS ---
        const nextPosition = camera.position.clone().add(velocity);
        
        // Floor bounds (50x50 centered at 0,0)
        const halfSize = 25; // 50 / 2
        nextPosition.x = Math.max(-halfSize, Math.min(halfSize, nextPosition.x));
        nextPosition.z = Math.max(-halfSize, Math.min(halfSize, nextPosition.z));
        
        camera.position.x = nextPosition.x;
        camera.position.z = nextPosition.z;
        // --- END OF INVISIBLE WALLS AMENDMENTS ---

        // Apply jumping and gravity
        jumpVelocity += gravity;
        camera.position.y += jumpVelocity;

        if (camera.position.y <= 2) {
            camera.position.y = 2;
            jumpVelocity = 0;
            isJumping = false;
        }
    }

    // --- START OF PULSING CIRCLES AMENDMENTS ---
    const time = Date.now() * 0.001; // Slow pulse
    rings.forEach((ring, i) => {
        const scale = 1 + Math.sin(time + i) * 0.2; // Pulse between 0.8 and 1.2
        ring.scale.set(scale, scale, 1);
        ringLights[i].intensity = 1 + Math.sin(time + i) * 0.5; // Light pulses too
    });
    // --- END OF PULSING CIRCLES AMENDMENTS ---

    renderer.render(scene, camera);
}

// Initial render
renderer.render(scene, camera);