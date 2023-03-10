<template>
  <el-dialog
    append-to-body
    v-model="dialogVisible"
    width="60%"
    :before-close="handleClose"
  >
    <template #header>
      <div class="dialogHeader">
        <span>水质信息</span>
      </div>
    </template>
    <el-form
      ref="ruleFormRef"
      :model="itemRuleForm"
      label-width="270px"
      :disabled="store.isDisabled"
      status-icon
    >
      <el-form-item
        v-for="(domain, index) in itemRuleForm"
        :key="index"
        :label="domain.label"
        :rules="{
          required: false,
          trigger: 'blur',
        }"
      >
        <el-input-number :min="0" v-model="domain.value" />
        <el-icon
          v-if="!store.isDisabled"
          @click.prevent="removeDomain(index)"
          style="margin-left: 10px; cursor: pointer"
          color="red"
          :size="30"
          ><CircleCloseFilled
        /></el-icon>
      </el-form-item>
    </el-form>
    <div v-if="!store.isDisabled" class="addItem" @click="addQuota">
      <el-icon color="#2f72f7" :size="24"><Plus /></el-icon>
      <span>新指标</span>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from "element-plus";
import { ElMessageBox, ElMessage } from "element-plus";
import type { waterModel } from "../models";
import { useUserStore } from "@/stores/user";

const props = defineProps({
  waterDialogVisible: {
    type: Boolean,
    default: false,
  },
});

const store = useUserStore();

const emit = defineEmits(["closeDialog", "setTableWater"]);

// 同步 props
const dialogVisible = computed(() => props.waterDialogVisible);
const ruleFormRef = ref<FormInstance>();

let itemIndex = $ref(0);
let itemRuleForm = $ref<waterModel[]>([
  {
    label: "PH值（mg/L）",
    value: 0,
  },
  {
    label: "悬浮物（mg/L）",
    value: 0,
  },
  {
    label: "化学需氧量（mg/L）",
    value: 0,
  },
  {
    label: "氨氮（mg/L）",
    value: 0,
  },
  {
    label: "总磷（mg/L）",
    value: 0,
  },
]);

const addQuota = () => {
  ElMessageBox.prompt("请输入指标名称", "添加指标", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    inputValidator: (value) => {
      if (value) return true;
      return false;
    },
    inputErrorMessage: "指标名称必填",
  })
    .then(({ value }) => {
      itemRuleForm.push({
        label: value,
        value: 0,
      });
    })
    .catch(() => {});
};

const removeDomain = (index: number) => {
  itemRuleForm.splice(index, 1);
};
const resetForm = () => {
  itemRuleForm = [
    {
      label: "PH值（mg/L）",
      value: 0,
    },
    {
      label: "悬浮物（mg/L）",
      value: 0,
    },
    {
      label: "化学需氧量（mg/L）",
      value: 0,
    },
    {
      label: "氨氮（mg/L）",
      value: 0,
    },
    {
      label: "总磷（mg/L）",
      value: 0,
    },
  ];
};

const setForm = (index: number, row: waterModel[]) => {
  itemRuleForm = row;
  itemIndex = index;
};

const handleClose = () => {
  emit("closeDialog");
};
const handle = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      emit("setTableWater", itemIndex, itemRuleForm);
      emit("closeDialog");
    }
  });
};
defineExpose({
  resetForm,
  setForm,
});
</script>

<style lang="scss" scoped>
.addItem {
  cursor: pointer;
  margin-top: 20px;
  height: 46px;
  background: #f4f9fe;
  border: 1px dashed #3179fc;
  display: flex;
  align-items: center;
  justify-content: center;
  span {
    font-size: 16px;
    color: #3179fc;
    margin-left: 10px;
  }
}
.dialogHeader {
  width: 100%;
  height: 60px;
  background: linear-gradient(to right, #7189f9, #2479fa, #6085f9, #2261eb);
  display: flex;
  flex-direction: column;
  justify-content: center;

  span {
    text-indent: 30px;
    font-size: 24px;
    line-height: 42px;
    font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
    font-weight: bold;
    color: #ffffff;
  }
}
.dialog-footer {
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>
