<template> 
  <Mesh cast-shadow receive-shadow :position="position">
    <SphereGeometry :radius="0.3" :width-segments="50" :height-segments="50" />
    <LambertMaterial color="#E0AD12" />
  </Mesh>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { SphereGeometry, Mesh, LambertMaterial } from 'troisjs'

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
</script>
