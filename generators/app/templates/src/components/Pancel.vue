<template>
  <div class="pancel-box">
    <div class="header">
      <div v-if="title" class="title">
        {{ title }}
        <div v-if="desc" class="desc">
          {{ desc }}
        </div>
      </div>
      <div v-if="more" class="more" @click="handleMoreClick">
        {{ more }}
      </div>
    </div>
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  title: {
    type: String,
    default: "",
  },
  desc: {
    type: String,
    default: "",
  },
  more: {
    type: String,
    default: "",
  },
  hasBorder: {
    type: Boolean,
    default: true,
  },
});
const emit = defineEmits(["more"]);
function handleMoreClick() {
  emit("more");
}
</script>

<style lang="scss" scoped>
.pancel-box {
  width: 100%;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.1);
  margin-top: 24px;
  .header {
    display: flex;
    height: 45px;
    align-items: center;
    padding: 0 15px;
    position: relative;
    &::after {
      content: "";
      position: absolute;
      top: 45px;
      width: 790px;
      height: 1px;
      background: rgba(0, 0, 0, 0.3);
    }
    .title {
      flex: 1;
      font-size: 24px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      position: relative;
      text-indent: 20px;
      &::before {
        content: " ";
        height: 8px;
        width: 8px;
        background: #4286f3;
        position: absolute;
        top: 10px;
        bottom: 0;
        margin: auto;
        left: 0;
      }
      .desc {
        font-size: 18px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #999999;
        position: relative;
        left: -16px;
        display: inline-block;
      }
    }
    .more {
      cursor: pointer;
      font-size: 18px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #3179fc;
    }
  }
  .content {
    padding: 15px;
  }
}
</style>
