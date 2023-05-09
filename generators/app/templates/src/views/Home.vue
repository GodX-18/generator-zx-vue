<template>
  <SvgIcon className="voice" iconClass="voice" color="#ff4145"></SvgIcon>
  <MouseTracker v-slot="{ time }">
    {{ time }}
  </MouseTracker>
</template>

<script lang="ts" setup>
import MouseTracker from "@/components/CurrentTime.vue";
</script>

<style lang="scss" scoped></style>
