import * as THREE from 'three';

export function createPaddle(texture) {
	const geometry = new THREE.BoxGeometry(8, 5.5, 1);  // Width, height, depth
	const material = new THREE.MeshBasicMaterial({ map:texture });
	const paddle = new THREE.Mesh(geometry, material);


	return paddle;
}
