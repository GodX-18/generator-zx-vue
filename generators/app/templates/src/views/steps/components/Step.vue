<template>
  <div class="step_page">
    <div class="step_page_header">
      <p>{{ store.businessName }}</p>
      <p>事项编码：{{ store.businessCode }}</p>
      <div class="steps">
        <el-steps align-center :active="activeIndex">
          <el-step v-for="(i, k) in steps" :key="k" :title="i.title">
            <template v-slot:icon>
              <img
                width="40"
                :src="
                  getStepsImageUrl(activeIndex >= k ? i.icon : i.icon + 's')
                "
              />
            </template>
          </el-step>
        </el-steps>
      </div>
    </div>
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from "@/stores/user";
const store = useUserStore();
defineProps({
  activeIndex: {
    type: Number,
    default: 0,
  },
});
// 工具函数 ----------------------------------------------------------------
// 引入本地图片
function getStepsImageUrl(name: string) {
  return new URL(`../../../assets/images/steps/${name}.png`, import.meta.url)
    .href;
}
// 步骤条相关 ---------------------------------------------------------------
const steps = [
  {
    title: "申报说明",
    icon: "step1",
  },
  {
    title: "基本情况",
    icon: "step2",
  },
  {
    title: "项目信息",
    icon: "step3",
  },
  {
    title: "排水户信息",
    icon: "step4",
  },
  {
    title: "排水管网信息",
    icon: "step5",
  },
  {
    title: "申报材料上传",
    icon: "step6",
  },
];
</script>

<style lang="scss" scoped>
.step_page {
  &_header {
    overflow: hidden;
    display: flex;
    flex-direction: column;
    height: 250px;
    background: #e9f2ff;
    margin-bottom: 28px;
    p:first-of-type {
      font-size: 28px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #333333;
      line-height: 40px;
      margin-left: 24px;
    }
    p:last-of-type {
      font-size: 18px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #2c5282;
      margin-left: 24px;
      margin-top: -12px;
    }
    .steps {
      flex: 1;
      box-sizing: border-box;
      background-color: #fff;
      margin: 0 16px 8px 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      :deep(.el-steps) {
        width: 100%;
      }
    }
  }
}
</style>
