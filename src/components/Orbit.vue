<template> 
  <Group ref="orbit">
    <Mesh :props="{ name: 'OrbitPlane' }" :on-pointer-move="onPointerMove" :on-pointer-down="onPointerDown" :on-pointer-up="onPointerUp">
      <PlaneGeometry :width="7" :height="7" />
      <LambertMaterial :props="{ opacity: DEBUG ? 0.5 : 0, transparent: true }" />
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
    // orbit.value!.group.rotateZ(0.002)
  })

  const moons = orbit.value!.group.children.filter((mesh: THREE.Mesh) => mesh.name === 'moon')
  useHighlight(renderer, moons)

  canvas.addEventListener('pointerdown', onPointerDown);
  canvas.addEventListener('pointerup', onPointerUp);
  canvas.addEventListener('pointerleave', onPointerUp);
})

let dragging = false
let previousPoint: THREE.Vector3 | null = null
const referentiel = new THREE.Vector3(1, 0, 0)

function onPointerMove(evt: any) {
  const orbitGroup = orbit.value!.group as THREE.Group
  previousPoint = evt.intersect.point
  const pointingAngle = previousPoint!.angleTo(referentiel)
  // console.log('rad:', pointingAngle, 'deg:', pointingAngle * 180/Math.PI, 'vector', previousPoint)

  if (dragging) {
    const angle = previousPoint!.y < 0 ? Math.PI - pointingAngle : pointingAngle
    console.log('angle', angle)
    orbitGroup.rotation.z = angle
  }
}

function onPointerDown() {
  dragging = true
}

function onPointerUp() {
  dragging = false
}
</script>
