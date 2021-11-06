<template>
  <Renderer ref="renderer" antialias :orbit-ctrl="{ enableDamping: true }" resize="window">
    <Camera :position="{ z: 7, y: 3, x: 10 }" />
    <Scene ref="scene">
      <HemisphereLight cast-shadow color="#ffffbb" :intensity="0.5" />
      <PointLight cast-shadow :position="{ y: 50, z: 50 }" :intensity="1" />
      <GltfModel
        ref="earth"
        src="/models/low_poly_earth.gltf"
        @error="onError"
        @load="onReady"
      >
      </GltfModel>
    </Scene>
  </Renderer>
</template>

<script lang="ts" setup>
import { ref, Ref, onMounted } from 'vue'
import { Box, Camera, Mesh, BasicMaterial, LambertMaterial, SphereGeometry, DirectionalLight, HemisphereLight, GltfModel, MeshPublicInterface, PointLight, Renderer, RendererPublicInterface, Scene } from 'troisjs'
import * as THREE from 'three'
import { useHelperGrid, createMoons, useDebug } from './use3d'

const scene: Ref<THREE.Scene | null> = ref(null)
const renderer: Ref<RendererPublicInterface | null> = ref(null)

const earthTilt = 23.4 * Math.PI / 180; // tilt in radians

const debug = useDebug(false)

function onError(err: any) {
  console.error(err)
}

function onReady(model: THREE.Group) {
  scene.value!.add(model)

  const meshGroup = model.children[0] as THREE.Group
  const [meshWater, meshEarth] = meshGroup.children as THREE.Mesh[]

  // Material color
  const waterColor = new THREE.MeshLambertMaterial({ color: 0x7DB3E7, side: THREE.BackSide });
  const earthColor = new THREE.MeshLambertMaterial({ color: 0x64E75B, side: THREE.DoubleSide });
  meshWater.material = waterColor
  meshEarth.material = earthColor

  // Rotate
  model.rotateOnAxis(new THREE.Vector3(1,0,0), 0.5)
  meshWater.geometry.applyMatrix4(new THREE.Matrix4().makeRotationZ(-earthTilt));
  meshEarth.geometry.applyMatrix4(new THREE.Matrix4().makeRotationZ(-earthTilt));
  const earthAxis = new THREE.Vector3(Math.sin(-earthTilt), Math.cos(-earthTilt), 0).normalize();
  renderer.value!.onBeforeRender(() => {
    model.children[0].rotateOnAxis(earthAxis, 0.002)
  })

  const orbit = createMoons(5, { renderer: renderer as Ref<RendererPublicInterface>, angle: earthTilt })
  scene.value!.add(orbit)
}

function createNewMoon(nbItems: number) {
  // const plane = new THREE.PlaneGeometry(10, 10)
  // const material = new THREE.MeshLambertMaterial({ color: 0x7eb3e7, side: THREE.DoubleSide, opacity: 0.5, transparent: true });
  // const referential = new THREE.Mesh(plane, material)
  const referential = new THREE.Object3D()
  for(let i = 0; i < nbItems; i++) {
    const moonMaterial = new THREE.MeshLambertMaterial({ color: 0xE0AD12, side: THREE.DoubleSide });
    const geometry = new THREE.SphereGeometry(0.3, 50, 50);
    const moonMesh = new THREE.Mesh(geometry, moonMaterial);
    moonMesh.castShadow = true
    moonMesh.receiveShadow = true;
    moonMesh.position.set(Math.cos(i * 2*Math.PI/nbItems) * 2, - Math.sin(i * 2*Math.PI/nbItems) * 2, 0);
    referential.add(moonMesh)
  }

  const axis = new THREE.Vector3(Math.sin(earthTilt), 0, Math.cos(earthTilt))
  referential.rotateOnAxis(axis, 1)

  renderer.value!.onBeforeRender(() => {
    referential.rotateOnAxis(new THREE.Vector3(0, 0, 1), 0.002)
  })

  scene.value!.add(referential)
}

onMounted(() => {
  if (debug.value) {
    scene.value!.add(useHelperGrid());
  }
})
</script>

<style>
body, html {
  margin: 0;
}
canvas {
  display: block;
}
</style>
