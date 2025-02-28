import * as THREE from 'three';

export function createFloor(scene) {
    const geometry = new THREE.BoxGeometry(50, 0.1, 50);
    const material = new THREE.MeshPhongMaterial({ color: 0x228B22 });
    const floor = new THREE.Mesh(geometry, material);
    floor.position.y = -1;
    scene.add(floor);
    return floor;
}