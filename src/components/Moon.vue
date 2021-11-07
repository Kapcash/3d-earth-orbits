<template> 
  <Mesh ref="moon" :props="{ name: 'moon' }" cast-shadow receive-shadow :position="position" :on-pointer-over="hovering">
    <SphereGeometry :radius="0.3" :width-segments="50" :height-segments="50" />
    <LambertMaterial :color="randomColor" />
  </Mesh>
</template>

<script lang="ts" setup>
import { computed, ref, Ref } from 'vue'
import { SphereGeometry, Mesh, LambertMaterial } from 'troisjs'
import * as THREE from 'three'

const moon: Ref<typeof Mesh | null> = ref(null)

const { index, nbMoons } = defineProps({
  index: { type: Number, required: true },
  nbMoons: { type: Number, required: true },
});

const position = computed(() => {
  const angleRad = index * 2*Math.PI/nbMoons
  return {
    x: Math.cos(angleRad) * 2,
    y: - Math.sin(angleRad) * 2,
    z: 0,
  }
})

const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16)

const HIGHLIGHT_COLOR = 0xffff00
let previousColor: any = null

function hovering(evt: any) {
  const material = ((evt.component.mesh as THREE.Mesh).material as THREE.MeshLambertMaterial)
  if (evt.over) {
    previousColor = material.color.clone()
  }
  material.color.set(evt.over ? HIGHLIGHT_COLOR : previousColor);
}
</script>
