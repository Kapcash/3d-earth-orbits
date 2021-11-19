<template> 
  <Mesh v-if="!model" ref="moon" :props="{ name: 'moon' }" cast-shadow receive-shadow :position="position" @pointerOver="hovering">
    <SphereGeometry :radius="0.3" :width-segments="50" :height-segments="50" />
    <LambertMaterial :color="randomColor" />
  </Mesh>
  <GltfModel
    v-else
    ref="moon"
    @pointerOver="hovering"
    :position="position"
    :rotation="rotate"
    :src="`/models/${model}.gltf`"
    @error="onError"
    @load="onMoonModelLoaded"
  />
</template>

<script lang="ts" setup>
import { inject, computed, reactive, ref, Ref, onMounted } from 'vue'
import { GltfModel, SphereGeometry, Mesh, LambertMaterial, RendererInjectionKey } from 'troisjs'
import * as THREE from 'three'

const orbit = inject('orbit') as Ref<any | null>
const renderer = inject(RendererInjectionKey)

const moon: Ref<typeof Mesh | null> = ref(null)
const rotate = reactive({ x: 0, y: 0, z: 0 })

const { index, nbMoons, model } = defineProps({
  index: { type: Number, required: true },
  nbMoons: { type: Number, required: true },
  model: { type: String, required: false },
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
  let object3d = evt.component.$.ctx.o3d as THREE.Object3D
  if (object3d.name !== 'moon') {
    object3d = object3d!.children.find(node => node.type === 'Mesh')!
  }
  const material = (object3d! as THREE.Mesh).material as THREE.MeshLambertMaterial
  if (evt.over) {
    previousColor = material.color.clone()
  }
  material.color.set(evt.over ? HIGHLIGHT_COLOR : previousColor);
}

function onError(err: any) {
  console.error('Model error:', err)
}

onMounted(() => {
  renderer?.onBeforeRender(() => {
    if (orbit?.value?.group) {
      rotate.z = - orbit.value.group.rotation.z
    }
  })
})

function onMoonModelLoaded(model: THREE.Group) {
  const mesh = model.children.find(node => node.type === 'Mesh')
  if (mesh) {
    renderer!.three.addIntersectObject(mesh)
    mesh.scale.multiplyScalar(0.5);
  }
}
</script>
