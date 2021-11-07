import { RendererPublicInterface } from 'troisjs'
import * as THREE from 'three';
import { ref } from 'vue';

export const DEBUG = true
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


export function useHighlight(renderer: RendererPublicInterface, objects: THREE.Object3D[]) {
  const mouse = useMouse(renderer.canvas!)
  const ray = new THREE.Raycaster();

  let intersectedObject: any | null = null
  const HIGHLIGHT_COLOR = 0xffff00

  function restorePreviousIntersectedColor() {
    if (intersectedObject) {
      intersectedObject.material.color.setHex(intersectedObject.currentHex);
    }
  }
  
  renderer.onBeforeRender(() => {
    ray.setFromCamera(mouse, renderer.camera!)
    const intersects = ray.intersectObjects(objects, true);
  
    if (intersects.length > 0) {
      const firstIntersectedObject = intersects[0].object
  
      if (firstIntersectedObject === intersectedObject) { return; }
  
      restorePreviousIntersectedColor()
  
      intersectedObject = firstIntersectedObject;
      intersectedObject.currentHex = intersectedObject.material.color.getHex();
      intersectedObject.material.color.setHex(HIGHLIGHT_COLOR);
    } else {
      restorePreviousIntersectedColor()
      intersectedObject = null;
    }
  })
}