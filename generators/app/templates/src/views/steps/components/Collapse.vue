<template>
  <div class="collapse">
    <el-collapse model-value="only" @change="handleChange">
      <el-collapse-item name="only">
        <template #title>
          <div class="header">
            <div v-if="title" class="title">
              {{ title }}
              <div v-if="desc" class="desc">
                {{ desc }}
              </div>
            </div>
          </div>
        </template>
        <div class="collapse-content">
          <slot />
        </div>
      </el-collapse-item>
    </el-collapse>
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
});
const headerBorder = ref("1048px");
function handleChange(e: any) {
  headerBorder.value = e[0] ? "1048px" : "";
}
</script>

<style lang="scss" scoped>
.el-collapse-item__wrap,
.el-collapse {
  border: none;
}
.collapse {
  position: relative;
  border: 1px solid rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
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
      width: v-bind(headerBorder);
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
  }
  .collapse-content {
    margin-top: 16px;
    padding: 0 16px;
  }
}
</style>
