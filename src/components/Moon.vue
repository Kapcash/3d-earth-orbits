<template> 
  <Mesh v-if="!model" ref="moon" :props="{ name: 'moon' }" cast-shadow receive-shadow :position="position" @pointerOver="hovering">
    <SphereGeometry :radius="0.3" :width-segments="50" :height-segments="50" />
    <LambertMaterial :color="randomColor" />
  </Mesh>
  <GltfModel
    v-else
    ref="moon"
    @pointerOver="hovering"
    @pointerEnter="setTooltip"
    @pointerLeave="resetTooltip"
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
import { useMouse, tooltip } from '../use3d'

const orbit = inject('orbit') as Ref<any | null>
const renderer = inject(RendererInjectionKey)

const moon: Ref<typeof Mesh | null> = ref(null)
const rotate = reactive({ x: 0, y: 0, z: 0 })
const DISABLED_METALNESS = 0.8

const { index, nbMoons, model, description, disabled } = defineProps({
  index: { type: Number, required: true },
  nbMoons: { type: Number, required: true },
  model: { type: String, required: false },
  description: { type: String, default: 'Testing' },
  disabled: { type: Boolean, default: false },
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
const mouse = useMouse(renderer!.canvas)

function setTooltip() {
  tooltip.x = mouse.x
  tooltip.y = mouse.y
  tooltip.text = description
  tooltip.active = true
}
function resetTooltip(evt: any) {
  tooltip.active = false
}

function hovering(evt: any) {
  if (disabled) { return; }

  const object3dTarget = evt.component.$.ctx.o3d as THREE.Object3D
  let object3d: Array<THREE.Object3D> = [object3dTarget]
  if (object3d[0].name !== 'moon') {
    object3d = getDeepMesh(object3d[0] as THREE.Group)
  }

  object3d.forEach((mesh) => {
    const material = (mesh! as THREE.Mesh).material as THREE.MeshLambertMaterial
    if (evt.over) {
      // @ts-ignore
      material.color.setHex(material.hoverColor)
    } else {
      // @ts-ignore
      material.color.setHex(mesh.material.previousColor);
    }
  })
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

function getDeepMesh(group: THREE.Group): Array<THREE.Mesh> {
  const allMeshes: Array<THREE.Mesh> = []
  const scaleMesh = (meshes: Array<THREE.Mesh>, group: THREE.Group) => {
    meshes.push(...group.children.filter(node => node.type === 'Mesh') as Array<THREE.Mesh>)

    const innerGroups = group.children.filter(node => node.type === 'Group') as Array<THREE.Group>
    innerGroups.forEach(grp => scaleMesh(meshes, grp))
  }
  scaleMesh(allMeshes, group)
  return allMeshes
}

function onMoonModelLoaded(model: THREE.Group) {
  const meshes = getDeepMesh(model)
  meshes.forEach(mesh => {
    renderer!.three.addIntersectObject(mesh)
    mesh.scale.multiplyScalar(0.5)
    const meshMaterial = (mesh.material as THREE.MeshStandardMaterial)
    // @ts-ignore
    mesh.material.previousColor = meshMaterial.color.getHex()
    // @ts-ignore
    mesh.material.hoverColor = meshMaterial.color.clone().offsetHSL(0, 0.2, -0.2).getHex()
    if (disabled) {
      meshMaterial.metalness = DISABLED_METALNESS
    }
  })
}
</script>
