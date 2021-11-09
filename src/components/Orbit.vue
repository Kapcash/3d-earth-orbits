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
import { DEBUG, earthTilt, useDragging, useMouse } from '../use3d';

const renderer = inject(RendererInjectionKey)!
const orbit: Ref<typeof Group | null> = ref(null)
const orbitPlane: Ref<typeof Mesh | null> = ref(null)
let previousAngle = 0
let previousZ = 0
let direction = 1

renderer.canvas!.addEventListener('pointerdown', onPointerDown)
renderer.canvas!.addEventListener('pointerup', onPointerUp)

onMounted(() => {
  const orbitGroup = (orbit.value!.group as THREE.Group)
  orbitGroup.rotateY(earthTilt);
  orbitGroup.rotateX(earthTilt);
  
  renderer.onBeforeRender(() => {
    orbit.value!.group.rotateZ(0.002)
  })
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
    orbitGroup.rotation.z += (pointingAngle - previousAngle) * sign
    direction = orbitGroup.rotation.z < previousZ ? -1 : 1
    previousAngle = pointingAngle
    previousZ = orbitGroup.rotation.z
  }
}

let alpha = 0.1

function onPointerDown(evt: any) {
  ray.setFromCamera(mouse, renderer.camera!)
  const intersects = ray.intersectObjects([orbit.value!.group.children[0]], false);

  if (intersects.length > 0) {
    previousAngle = intersects[0].point.angleTo(referentiel)
    dragging.value = true
  }
}

let origin: THREE.Vector3;
let target: THREE.Vector3;
function onPointerUp(evt: any) {
  alpha = 0.1
  dragging.value = false
  const orbitGroup = orbit.value!.group as THREE.Group
  origin = new THREE.Vector3(orbitGroup.rotation.x, orbitGroup.rotation.y, orbitGroup.rotation.z);
  target = new THREE.Vector3(origin.x, origin.y, origin.z + (Math.PI * direction))
}

renderer.onBeforeRender(() => {
  if (origin && !origin.equals(target)) {
    origin.lerp(target, alpha)
    orbit.value!.group.rotation.z = origin.z
    if (Math.abs(target.z - origin.z) < 0.05) {
      alpha = 1
    }
  }
})

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
