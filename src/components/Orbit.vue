<template> 
  <Group ref="orbit">
    <Mesh ref="orbitPlane" :props="{ name: 'OrbitPlane' }" :on-pointer-move="onPointerMove">
      <PlaneGeometry :width="7" :height="7" />
      <LambertMaterial :props="{ side: 2, opacity: DEBUG ? 0.5 : 0, transparent: true }" />
    </Mesh>
    <slot />
  </Group>
</template>

<script lang="ts" setup>
import { inject, ref, Ref, onMounted } from 'vue'
import { RendererInjectionKey, Group, Mesh, PlaneGeometry, LambertMaterial } from 'troisjs'
import * as THREE from 'three'
import { DEBUG, earthTilt, useHighlight, useDragging, useMouse } from '../use3d';

const renderer = inject(RendererInjectionKey)!
const orbit: Ref<typeof Group | null> = ref(null)
const orbitPlane: Ref<typeof Mesh | null> = ref(null)
let previousZ = 0

renderer.canvas!.addEventListener('pointerdown', onPointerDown)
renderer.canvas!.addEventListener('pointerup', onPointerUp)

onMounted(() => {
  const orbitGroup = (orbit.value!.group as THREE.Group)
  orbitGroup.rotateY(earthTilt);
  orbitGroup.rotateX(earthTilt);
  previousZ = orbitGroup.rotation.z
  
  renderer.onBeforeRender(() => {
    // orbit.value!.group.rotateZ(0.002)
  })

  const moons = orbit.value!.group.children.filter((mesh: THREE.Mesh) => mesh.name === 'moon')
  useHighlight(renderer, moons)
})

let dragging = useDragging()
const referentiel = new THREE.Vector3(Math.cos(earthTilt) * Math.PI, 0, -Math.sin(earthTilt) * Math.PI)

const ray = new THREE.Raycaster();
const mouse = useMouse(renderer.canvas);

let previousPoint: THREE.Vector3 | null = null

function onPointerMove(evt: any) {
  const orbitGroup = orbit.value!.group as THREE.Group
  previousPoint = evt.intersect.point
  const pointingAngle = previousPoint!.angleTo(referentiel)

  if (dragging.value) {
    const sign = previousPoint!.y < 0 ? -1 : 1
    orbitGroup.rotation.z += (pointingAngle - previousZ) * sign
    previousZ = pointingAngle
  }
}

function onPointerDown(evt: any) {
  ray.setFromCamera(mouse, renderer.camera!)
  const intersects = ray.intersectObjects([orbit.value!.group.children[0]], false);

  if (intersects.length > 0) {
    previousZ = intersects[0].point.angleTo(referentiel)
    dragging.value = true
  }
}

function onPointerUp(evt: any) {
  dragging.value = false
}

if (DEBUG) {
  const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
  const points = [
    new THREE.Vector3(0, 0, 0),
    referentiel,
  ];
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const line = new THREE.Line(geometry, material);
  renderer.scene!.add(line)
}
</script>
