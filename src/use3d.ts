import { RendererPublicInterface } from 'troisjs'
import * as THREE from 'three';
import { ref } from 'vue';

export const DEBUG = false
export const earthTilt = 23.4 * Math.PI / 180; // tilt in radians

export function useMouse(wrapper: HTMLCanvasElement) {
  const mouse = new THREE.Vector2();

  function onMouseMove(event: MouseEvent) {
    mouse.x = (event.clientX / wrapper.width) * 2 - 1;
    mouse.y = - (event.clientY / wrapper.height) * 2 + 1;
  }

  wrapper.addEventListener('mousemove', onMouseMove)

  return mouse
}

let dragging = ref(false)
export function useDragging() {
  return dragging
}
