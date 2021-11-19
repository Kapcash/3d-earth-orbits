<template> 
  <Group ref="orbit">
    <Mesh ref="orbitPlane" :props="{ name: 'OrbitPlane' }" :on-pointer-move="onPointerMove">
      <PlaneGeometry :width="7" :height="7" />
      <LambertMaterial :props="{ side: 2, opacity: DEBUG ? 0.5 : 0, transparent: true }" />
    </Mesh>
    <slot />

    <div class="gui">
      <p>diff: {{ diff }}</p>
      <p>target: {{ diff * 40 }}</p>
      <p>alpha: {{ alpha }}</p>
      <p>previousAngle: {{ previousAngle }}</p>
      <p>previousZ: {{ previousZ }}</p>
      <p>direction: {{ direction }}</p>
    </div>
  </Group>
</template>

<script lang="ts" setup>
import { provide, inject, ref, Ref, onMounted, reactive } from 'vue'
import { RendererInjectionKey, Group, Mesh, PlaneGeometry, LambertMaterial } from 'troisjs'
import * as THREE from 'three'
import { DEBUG, earthTilt, useDragging, useMouse } from '../use3d';

const renderer = inject(RendererInjectionKey)!
const orbit: Ref<typeof Group | null> = ref(null)
const orbitPlane: Ref<typeof Mesh | null> = ref(null)
let previousAngle = ref(0)
let diff = ref(0)
let previousZ = ref(0)
let direction = ref(1)

provide('orbit', orbit)

// renderer.canvas!.addEventListener('pointerdown', onPointerDown)
// renderer.canvas!.addEventListener('pointerup', onPointerUp)

onMounted(() => {
  const orbitGroup = (orbit.value!.group as THREE.Group)
  orbitGroup.rotateY(earthTilt);
  orbitGroup.rotateX(earthTilt);
  
  renderer.onBeforeRender(() => {
    orbit.value!.group.rotateZ(0.002 * direction.value)
  })
})

let dragging = useDragging()
const referentiel = new THREE.Vector3(Math.cos(earthTilt) * Math.PI, 0, -Math.sin(earthTilt) * Math.PI)

const ray = new THREE.Raycaster();
const mouse = useMouse(renderer.canvas);

let previousPoint: THREE.Vector3 | null = null

function onPointerMove(evt: any) {
  if (dragging.value) {
    const orbitGroup = orbit.value!.group as THREE.Group
    previousPoint = evt.intersect.point
    const pointingAngle = previousPoint!.angleTo(referentiel)
    const sign = previousPoint!.y < 0 ? -1 : 1
    diff.value = Math.abs(pointingAngle - previousAngle.value)
    orbitGroup.rotation.z += (pointingAngle - previousAngle.value) * sign
    direction.value = orbitGroup.rotation.z < previousZ.value ? -1 : 1
    previousAngle.value = pointingAngle
    previousZ.value = orbitGroup.rotation.z
  }
}

let alpha = ref(0.1)

function onPointerDown(evt: any) {
  ray.setFromCamera(mouse, renderer.camera!)
  const intersects = ray.intersectObjects([orbit.value!.group.children[0]], false);

  if (intersects.length > 0) {
    previousAngle.value = intersects[0].point.angleTo(referentiel)
    dragging.value = true
  }
}

let origin: THREE.Vector3;
let target: THREE.Vector3;
function onPointerUp(evt: any) {
  alpha.value = diff.value * 2
  dragging.value = false
  const orbitGroup = orbit.value!.group as THREE.Group
  origin = new THREE.Vector3().applyEuler(orbitGroup.rotation);
  const targetOffset = diff.value * 40 * direction.value
  target = new THREE.Vector3(origin.x, origin.y, origin.z + targetOffset)
}

// renderer.onBeforeRender(() => {
//   if (origin && !origin.equals(target)) {
//     origin.lerp(target, alpha.value)
//     orbit.value!.group.rotation.z = origin.z
//     if (Math.abs(target.z - origin.z) < 0.05) {
//       alpha.value = 1
//     }
//   }
// })

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

<style scoped>
.gui {
  position: absolute;
  bottom: 20px;
  left: 20px;
  color: white;
}
p {
  margin: 0px;
}
</style>