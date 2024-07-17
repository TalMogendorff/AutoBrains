<template>
  <div>
    <q-splitter v-model="splitterModel" style="height: 100vh">
      <template v-slot:before>
        <q-tabs
          v-model="tabName"
          inline-label
          vertical
          class="bg-purple text-white shadow-2"
        >
          <q-tab
            v-for="(tab, i) in tabs"
            :name="tab.name"
            :icon="tab.icon"
            :label="tab.label"
            :key="i"
          />
        </q-tabs>
      </template>
      <template v-slot:after>
        <q-tab-panels vertical v-model="tabName" animated>
          <q-tab-panel :name="tabName" class="full-width">
            <component :is="selectedComponent" />
          </q-tab-panel>
        </q-tab-panels>
      </template>
    </q-splitter>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import Canvas from "src/components/Canvas.vue";
import ThreeJS3D from "src/components/ThreeJS3D.vue";

const componentBasedOnName = {
  canvas: Canvas,
  "3D": ThreeJS3D,
};

const tabName = ref("canvas");
const tabs = ref([
  {
    name: "canvas",
    icon: "alarm",
    label: "Canvas",
  },
  {
    name: "3D",
    icon: "movie",
    label: "3D Three JS",
  },
]);

const selectedComponent = computed(() => {
  return componentBasedOnName[tabName.value];
});
</script>

<style lang="scss" scoped>
</style>
