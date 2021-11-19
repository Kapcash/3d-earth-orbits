<template>
  <Renderer ref="renderer" antialias :orbit-ctrl="{ enableDamping: true, enabled: false }" resize="window">
    <Camera :position="{ z: 5, y: 3, x: 5 }" />
    <Scene ref="scene">
      <HemisphereLight cast-shadow color="#ffffbb" :intensity="0.5" />
      <PointLight cast-shadow :position="{ y: 50, z: 50 }" :intensity="1" />
      <Earth />

      <Orbit ref="orbit">
        <Moon v-for="i in 5" :index="i" :nb-moons="5" :model="i === 1 ? 'music' : i === 2 ? 'star' : undefined" />
      </Orbit>
    </Scene>
  </Renderer>
</template>

<script lang="ts" setup>
import { ref, Ref, onMounted } from 'vue'
import { Camera, HemisphereLight, PointLight, Renderer, RendererPublicInterface, Scene } from 'troisjs'
import * as THREE from 'three'
import { DEBUG } from './use3d'
import Moon from './components/Moon.vue'
import Orbit from './components/Orbit.vue'
import Earth from './components/Earth.vue'

const scene: Ref<typeof Scene | null> = ref(null)
const renderer: Ref<RendererPublicInterface | null> = ref(null)

onMounted(() => {
  if (DEBUG) {
    scene.value!.add(new THREE.GridHelper(10, 50));
	  scene.value!.add(new THREE.AxesHelper( 5 ));
  }
})
</script>

<style>
h1 {
  position: absolute;
  color: white;
  top: 10px;
  left: 10px;
}
body, html {
  margin: 0;
}
canvas {
  display: block;
}
</style>
