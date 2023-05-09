<script setup lang="ts">
import { RouterView } from "vue-router";
</script>

<template>
  <div class="layout_container">
    <RouterView />
  </div>
</template>

<style lang="scss" scoped>
.layout_container {
  width: 100%;
  position: relative;
}
</style>
