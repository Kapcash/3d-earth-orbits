<template>
  <Renderer ref="renderer" antialias :orbit-ctrl="{ enableDamping: true }" resize="window">
    <Camera :position="{ z: 5 }" />
    <Scene ref="scene">
      <HemisphereLight cast-shadow color="#ffffbb" :intensity="0.5" />
      <PointLight cast-shadow :position="{ y: 50, z: 50 }" :intensity="1" />
      <GltfModel
        ref="earth"
        src="/models/low_poly_earth.gltf"
        :rotation="{ x: 0, y: 0.5, z: 0 }"
        @error="onError"
        @load="onReady"
      />
    </Scene>
  </Renderer>
</template>

<script lang="ts" setup>
import { defineComponent, ref, Ref } from 'vue'
import { Box, Camera, LambertMaterial, DirectionalLight, HemisphereLight, GltfModel, MeshPublicInterface, PointLight, Renderer, RendererPublicInterface, Scene } from 'troisjs'
import { DoubleSide, BackSide, MeshLambertMaterial, Vector3, Matrix4, Scene as TScene, Object3D } from 'three'

const scene = ref(null) as Ref<TScene | null>
const earth = ref(null) as Ref<any | null>

function onError(err: any) {
  console.error(err)
}

function onReady(model: any) {
  scene.value!.add(model)

  const waterColor = new MeshLambertMaterial({ color: 0x7DB3E7, side: BackSide, wireframe: false });
  const earthColor = new MeshLambertMaterial({ color: 0x64E75B, side: DoubleSide, wireframe: false });
  model.rotateOnAxis(new Vector3( 1,0,0), 0.5)
  model.traverse((child: any) => {
    if (child.isMesh) {
      const asArray = Array.isArray(child.material) ? child.material : [child.material]
      asArray.forEach((mat: any) => mat.metalness = 0)
      child.name === 'Sphere004' ? child.material = waterColor : child.material = earthColor
    }
  });

  const { renderer } = earth.value!
  var tilt = 23.4 * Math.PI / 180; // tilt in radians
  const [meshWater, meshEarth] = model.children[0].children
  meshWater.geometry.applyMatrix4(new Matrix4().makeRotationZ(-tilt));
  meshEarth.geometry.applyMatrix4(new Matrix4().makeRotationZ(-tilt));
  const earthAxis = new Vector3(Math.sin(-tilt), Math.cos(-tilt), 0).normalize();
  renderer.onBeforeRender(() => {
    model.children[0].rotateOnAxis(earthAxis, 0.002)
  })
}
</script>

<style>
body, html {
  margin: 0;
}
canvas {
  display: block;
}
</style>
