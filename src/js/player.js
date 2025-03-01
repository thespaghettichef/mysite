import * as THREE from 'three';


// player movment
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
const velocity = new THREE.Vector3();
const speed = 0.10;

let isLocked = false;
const euler = new THREE.Euler(0, 0, 0, 'YXZ');
const PI_2 = Math.PI / 2;

 // player jump
let jumpVelocity = 0;
const gravity = -0.02;
const jumpStrength = 0.3;
let isJumping = false;

export function setupPlayer(camera) {
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
}

export function updatePlayer(camera, floor) {
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

        const nextPosition = camera.position.clone().add(velocity);
        const halfSize = 25;
        nextPosition.x = Math.max(-halfSize, Math.min(halfSize, nextPosition.x));
        nextPosition.z = Math.max(-halfSize, Math.min(halfSize, nextPosition.z));
        camera.position.x = nextPosition.x;
        camera.position.z = nextPosition.z;

        jumpVelocity += gravity;
        camera.position.y += jumpVelocity;
        if (camera.position.y <= 2) {
            camera.position.y = 2;
            jumpVelocity = 0;
            isJumping = false;
        }
    }
}