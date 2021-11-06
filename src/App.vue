<template>
  <Renderer ref="renderer" antialias :orbit-ctrl="{ enableDamping: true }" resize="window">
    <Camera :position="{ z: 7, y: 3, x: 10 }" />
    <Scene ref="scene">
      <HemisphereLight cast-shadow color="#ffffbb" :intensity="0.5" />
      <PointLight cast-shadow :position="{ y: 50, z: 50 }" :intensity="1" />
      <Earth />

      <Orbit ref="orbit">
        <Moon v-for="i in 5" :index="i" :nb-moons="5" />
      </Orbit>
    </Scene>
  </Renderer>
</template>

<script lang="ts" setup>
import { ref, Ref, onMounted } from 'vue'
import { Camera, HemisphereLight, PointLight, Renderer, RendererPublicInterface, Scene } from 'troisjs'
import * as THREE from 'three'
import { useDebug } from './use3d'
import Moon from './components/Moon.vue'
import Orbit from './components/Orbit.vue'
import Earth from './components/Earth.vue'

const scene: Ref<THREE.Scene | null> = ref(null)

const debug = useDebug(false)

onMounted(() => {
  if (debug.value) {
    scene.value!.add(new THREE.GridHelper(10, 50));
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
