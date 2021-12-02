import { RendererPublicInterface } from 'troisjs'
import * as THREE from 'three';
import { reactive, ref } from 'vue';

export const DEBUG = false
export const earthTilt = 23.4 * Math.PI / 180; // tilt in radians

export function useMouse(wrapper: HTMLCanvasElement, asVector: boolean = false) {
  const mouse = asVector ? new THREE.Vector2() : reactive({ x: 0, y: 0 });

  function onMouseMoveVector(event: MouseEvent) {
    mouse.x = (event.clientX / wrapper.width) * 2 - 1;
    mouse.y = - (event.clientY / wrapper.height) * 2 + 1;
  }
  function onMouseMove(event: MouseEvent) {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
  }

  wrapper.addEventListener('mousemove', asVector ? onMouseMoveVector : onMouseMove)

  return mouse
}

let dragging = ref(false)
export function useDragging() {
  return dragging
}

export const tooltip = reactive({
  text: 'test',
  x: 0,
  y: 0,
  active: false,
})
