import * as THREE from 'three';

export function createRings(scene) {
    const ringPositions = [
        new THREE.Vector3(30, 10, 30),
        new THREE.Vector3(-30, 10, 30),
        new THREE.Vector3(30, 10, -30),
        new THREE.Vector3(-30, 10, -30)
    ];

    const rings = [];
    const ringLights = [];

    ringPositions.forEach((pos) => {
        const ringGeometry = new THREE.RingGeometry(2, 3, 32);
        const ringMaterial = new THREE.MeshBasicMaterial({ color: 0xaaaaaa, side: THREE.DoubleSide });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.position.copy(pos);
        ring.rotation.x = -Math.PI / 2;
        scene.add(ring);
        rings.push(ring);

        const spotLight = new THREE.SpotLight(0xffffff, 1, 50, Math.PI / 6, 0.5);
        spotLight.position.copy(pos);
        spotLight.target.position.set(pos.x, -1, pos.z);
        scene.add(spotLight);
        scene.add(spotLight.target);
        ringLights.push(spotLight);
    });

    return { rings, ringLights };
}

export function updateRings(rings, ringLights) {
    const time = Date.now() * 0.001;
    rings.forEach((ring, i) => {
        const scale = 1 + Math.sin(time + i) * 0.2;
        ring.scale.set(scale, scale, 1);
        ringLights[i].intensity = 1 + Math.sin(time + i) * 0.5;
    });
}