<template>
  <p class="bgTitle">{{ title }}</p>
  <div class="bg_content" v-bind="$attrs">
    <slot />
  </div>
</template>

<script lang="ts" setup>
defineProps({
  title: {
    type: String,
    default: "",
  },
});
</script>

<style lang="scss" scoped>
.bgTitle {
  font-size: 18px;
  color: #000000;
  margin-bottom: 20px;
}
.bg_content {
  background: rgba(204, 204, 204, 0.1);
  padding: 20px;
  box-sizing: border-box;
}
</style>
