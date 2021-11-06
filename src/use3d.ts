import { ref, Ref } from 'vue';

const debug: Ref<boolean> = ref(false)
export function useDebug(initVal?: boolean) {
  if (initVal !== undefined) {
    debug.value = initVal
  }
  return debug
}

export const earthTilt = 23.4 * Math.PI / 180; // tilt in radians
