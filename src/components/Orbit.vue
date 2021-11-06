<template> 
  <Group ref="orbit">
    <slot />
  </Group>
</template>

<script lang="ts" setup>
import { inject, computed, ref, Ref, onMounted } from 'vue'
import { RendererInjectionKey, Group } from 'troisjs'
import * as THREE from 'three'
import { earthTilt } from '../use3d';

const axis = new THREE.Vector3(Math.sin(earthTilt), 0, Math.cos(earthTilt))
const renderer = inject(RendererInjectionKey)
const orbit: Ref<typeof Group | null> = ref(null)

onMounted(() => {
  orbit.value!.group.rotateOnAxis(axis, 1)
  
  renderer!.onBeforeRender(() => {
    orbit.value!.group.rotateOnAxis(new THREE.Vector3(0, 0, 1), 0.002)
  })
})
</script>
