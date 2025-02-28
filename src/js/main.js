import * as THREE from 'three';
import { createFloor } from './floor.js';
import { setupPlayer, updatePlayer } from './player.js';
import { createSun } from './sun.js';
import { createRings, updateRings } from './rings.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xB0E0E6); // Sky color (background)
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

// Floor
const floor = createFloor(scene);

// Camera setup
camera.position.set(0, 2, 5);

// Player
setupPlayer(camera);

// Sun
createSun(scene);

// Rings
const { rings, ringLights } = createRings(scene);

function animate() {
    updatePlayer(camera, floor);
    updateRings(rings, ringLights);
    renderer.render(scene, camera);
}

// Initial render
renderer.render(scene, camera);