<template>
  <GltfModel
    ref="earth"
    src="/models/low_poly_earth.gltf"
    @error="onError"
    @load="onReady"
  >
  </GltfModel>
</template>

<script lang="ts" setup>
import { inject } from 'vue'
import { GltfModel, RendererInjectionKey } from 'troisjs'
import * as THREE from 'three'
import { earthTilt } from '../use3d'

const renderer = inject(RendererInjectionKey)

function onError(err: any) {
  console.error(err)
}

function onReady(model: THREE.Group) {
  const meshGroup = model.children[0] as THREE.Group
  const [meshWater, meshEarth] = meshGroup.children as THREE.Mesh[]

  // Material color
  const waterColor = new THREE.MeshLambertMaterial({ color: 0x7DB3E7, side: THREE.BackSide });
  const earthColor = new THREE.MeshLambertMaterial({ color: 0x64E75B, side: THREE.DoubleSide });
  meshWater.material = waterColor
  meshEarth.material = earthColor

  // Rotate
  model.rotateOnAxis(new THREE.Vector3(1,0,0), 0.5)
  const earthTiltRotation = new THREE.Matrix4().makeRotationZ(-earthTilt)
  meshWater.geometry.applyMatrix4(earthTiltRotation);
  meshEarth.geometry.applyMatrix4(earthTiltRotation);
  const earthAxis = new THREE.Vector3(Math.sin(-earthTilt), Math.cos(-earthTilt), 0).normalize();

  renderer!.onBeforeRender(() => {
    model.children[0].rotateOnAxis(earthAxis, 0.002)
  })
}
</script>
