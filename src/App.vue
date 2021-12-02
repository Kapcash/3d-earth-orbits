<template>
  <Renderer ref="renderer" antialias :orbit-ctrl="{ enableDamping: true, enabled: true }" resize="window">
    <Camera :position="{ z: 5, y: 3, x: 5 }" />
    <Scene ref="scene">
      <HemisphereLight cast-shadow color="#ffffbb" :intensity="0.5" />
      <PointLight cast-shadow :position="{ y: 50, z: 50 }" :intensity="1" />
      <Earth />

      <Orbit ref="orbit">
        <Moon v-for="(model, i) in modelNames" :index="i" :nb-moons="5" :model="model.model" :description="model.description" />
      </Orbit>
    </Scene>
    <span class="tooltip" :style="`top: ${tooltip.y}px; left: ${tooltip.x}px; opacity: ${tooltip.active ? 1 : 0}`">{{ tooltip.text }}</span>
  </Renderer>
</template>

<script lang="ts" setup>
import { ref, Ref, onMounted } from 'vue'
import { Camera, HemisphereLight, PointLight, Renderer, RendererPublicInterface, Scene } from 'troisjs'
import * as THREE from 'three'
import { DEBUG, tooltip } from './use3d'
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

const modelNames = [
  { model: 'music', description: "I'm a guitarist and a drummer!" },
  { model: 'computer', description: 'I am graduated of an Engineer Computer Science Degree', },
  { model: 'gym', description: 'Get in shape' },
  { model: 'minecraft', description: 'Gamer' },
  { model: 'folder-fav', description: 'Dunno' },
]
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

#app {
  position: relative;
}
.tooltip {
  position: absolute;
  top: 0px;
  left: 0px;
  min-width: 80px;
  color: white;
  background: rgba(100, 2, 51, 0.322);
  border: 1px solid rgb(100, 2, 51);
  border-radius: 4px;
  padding: 4px 8px;
  max-width: 160px;
  white-space: normal;
  text-align: center;
  transition: opacity 200ms ease-in-out;
}
</style>
