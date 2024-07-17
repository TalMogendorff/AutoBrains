<template>
  <div class="row justify-center">
    <div
      ref="container"
      :style="{ width: width + 'px', height: height + 'px' }"
    ></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watchEffect } from "vue";
import { useWebSocket } from "@vueuse/core";
import * as THREE from "three";

const props = defineProps({
  width: {
    type: Number,
    default: 1200,
  },
  height: {
    type: Number,
    default: 800,
  },
});

const container = ref(null);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  props.width / props.height,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();

const { data } = useWebSocket("ws://localhost:3001", {
  autoReconnect: {
    retries: 3,
    delay: 1000,
    onFailed() {
      alert("Failed to connect WebSocket after 3 retries");
    },
  },
});

onMounted(() => {
  renderer.setSize(props.width, props.height);
  container.value.appendChild(renderer.domElement);

  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  camera.position.z = 5;

  const animate = function () {
    requestAnimationFrame(animate);

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render(scene, camera);
  };

  animate();
});

onUnmounted(() => {
  if (container.value) {
    container.value.removeChild(renderer.domElement);
  }
});

watchEffect(() => {
  if (data.value) {
    try {
      const item = JSON.parse(data.value);
      /* Ben or Aviad, I havnt finish this one, just played with it to see whats going on, was using the Docs of threeJS and some GPT for assist. */
    } catch (error) {
      console.error("Error handling 3D data:", error);
    }
  }
});
</script>


<style scoped>
div {
  border: 1px solid black;
}
</style>
