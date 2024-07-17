<template>
  <div class="row justify-center">
    <canvas ref="canvas" :width="width" :height="height"></canvas>
  </div>
</template>

<script setup>
import { ref, watchEffect, onMounted } from "vue";
import { useWebSocket } from "@vueuse/core";

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

const canvas = ref(null);
const shape = ref(null);

const lastPoint = ref(null);
const lastRectangle = ref(null);

const { data } = useWebSocket("ws://localhost:3000", {
  autoReconnect: {
    retries: 3,
    delay: 1000,
    onFailed() {
      alert("Failed to connect WebSocket after 3 retries");
    },
  },
});

const drawRectangle = (rect, color) => {
  shape.value.fillStyle = color;
  shape.value.fillRect(
    rect.X * props.width,
    rect.Y * props.height,
    rect.Width * props.width,
    rect.Height * props.height
  );
  shape.value.strokeText(
    `ts: ${rect.ts}`,
    rect.X * props.width,
    rect.Y * props.height - 10
  );
};

const drawPoint = (point) => {
  shape.value.fillStyle = "blue";
  shape.value.beginPath();
  shape.value.arc(
    point.X * props.width,
    point.Y * props.height,
    5,
    0,
    2 * Math.PI
  );
  shape.value.fill();
  shape.value.strokeText(
    `ts: ${point.ts}`,
    point.X * props.width + 10,
    point.Y * props.height + 10
  );
};

const pointInsideRectangle = (point, rect) => {
  return (
    point.X >= rect.X &&
    point.X <= rect.X + rect.Width &&
    point.Y >= rect.Y &&
    point.Y <= rect.Y + rect.Height
  );
};

watchEffect(() => {
  if (data.value) {
    try {
      const item = JSON.parse(data.value);

      if (item.Width) {
        lastRectangle.value = item;
      } else {
        lastPoint.value = item;
      }
      /* Ben or Aviad, Idk if the meaning is to render while you have both data, if so this is the solution in my opinion */
      if (lastPoint.value && lastRectangle.value) {
        shape.value.clearRect(0, 0, props.width, props.height);
        drawPoint(lastPoint.value);

        const color = pointInsideRectangle(lastPoint.value, lastRectangle.value)
          ? "green"
          : "red";
        drawRectangle(lastRectangle.value, color);
      }
    } catch (error) {
      console.error("Error parsing data or drawing:", error);
    }
  }
});

onMounted(() => {
  shape.value = canvas.value.getContext("2d");
});
</script>

<style scoped>
canvas {
  border: 1px solid black;
}
</style>
