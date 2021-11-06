<template> 
  <Group ref="orbit">
    <Mesh v-if="DEBUG">
      <PlaneGeometry :width="10" :height="10" />
      <LambertMaterial color="0x7eb3e7" :props="{ opacity: 0.5, transparent: true }" />
    </Mesh>
    <slot />
  </Group>
</template>

<script lang="ts" setup>
import { inject, ref, Ref, onMounted } from 'vue'
import { RendererInjectionKey, Group, Mesh, PlaneGeometry, LambertMaterial } from 'troisjs'
import * as THREE from 'three'
import { DEBUG, earthTilt, useHighlight } from '../use3d';

const axis = new THREE.Vector3(Math.sin(earthTilt), 0, Math.cos(earthTilt))
const renderer = inject(RendererInjectionKey)!
const canvas = renderer.renderer.domElement

const orbit: Ref<typeof Group | null> = ref(null)

onMounted(() => {
  orbit.value!.group.rotateOnAxis(axis, 1)
  
  renderer.onBeforeRender(() => {
    orbit.value!.group.rotateOnAxis(new THREE.Vector3(0, 0, 1), 0.002)
  })

  const moons = orbit.value!.group.children.filter((mesh: THREE.Mesh) => mesh.name === 'moon')
  useHighlight(renderer, moons)

  canvas.addEventListener('pointermove', onPointerMove);
  canvas.addEventListener('pointerdown', onPointerDown);
  canvas.addEventListener('pointerup', onPointerUp);
  canvas.addEventListener('pointerleave', onPointerUp);
})

let dragging = false

function onPointerMove() {
  const orbitGroup = orbit.value!.group
  if (dragging) {
    orbitGroup.rotateOnAxis(new THREE.Vector3(0, 0, 1), 0.005)
  }
}

function onPointerDown() {
  dragging = true
}

function onPointerUp() {
  dragging = false
}
</script>
