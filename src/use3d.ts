import { RendererPublicInterface } from 'troisjs'
import * as THREE from 'three'
import { ref, Ref } from 'vue';

export function useHelperGrid(size: number = 10, divisions: number = 50) {
  return new THREE.GridHelper(size, divisions);
}

const debug = ref(false)
export function useDebug(initVal?: boolean) {
  if (initVal !== undefined) {
    debug.value = initVal
  }
  return debug
}

export const earthTilt = 23.4 * Math.PI / 180; // tilt in radians

export function createMoons(nbItems: number, options: { renderer: Ref<RendererPublicInterface>, angle: number }) {
  let orbit = new THREE.Object3D()

  const debug = useDebug()

  if (debug.value) {
    const plane = new THREE.PlaneGeometry(10, 10)
    const material = new THREE.MeshLambertMaterial({ color: 0x7eb3e7, side: THREE.DoubleSide, opacity: 0.5, transparent: true });
    orbit = new THREE.Mesh(plane, material)
  }

  for(let i = 0; i < nbItems; i++) {
    const moonMaterial = new THREE.MeshLambertMaterial({ color: 0xE0AD12, side: THREE.DoubleSide });
    const geometry = new THREE.SphereGeometry(0.3, 50, 50);
    const moonMesh = new THREE.Mesh(geometry, moonMaterial);
    moonMesh.castShadow = true
    moonMesh.receiveShadow = true;
    moonMesh.position.set(Math.cos(i * 2*Math.PI/nbItems) * 2, - Math.sin(i * 2*Math.PI/nbItems) * 2, 0);
    orbit.add(moonMesh)
  }

  const axis = new THREE.Vector3(Math.sin(options.angle), 0, Math.cos(options.angle))
  orbit.rotateOnAxis(axis, 1)

  options.renderer.value!.onBeforeRender(() => {
    orbit.rotateOnAxis(new THREE.Vector3(0, 0, 1), 0.002)
  })

  return orbit
}
