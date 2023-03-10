<template>
  <el-dialog
    append-to-body
    v-model="dialogVisible"
    width="60%"
    :before-close="handleClose"
  >
    <template #header>
      <div class="dialogHeader">
        <span>{{ dialogTitle }}</span>
      </div>
    </template>
    <el-form
      ref="ruleFormRef"
      :model="itemRuleForm"
      :rules="itemRules"
      label-width="270px"
      status-icon
    >
      <el-form-item label="排水口编号" prop="drainNum">
        <el-input v-model="itemRuleForm.drainNum" />
      </el-form-item>
      <el-form-item label="连接管排水管径（mm）" prop="drainMm">
        <el-input-number :min="0" v-model="itemRuleForm.drainMm" />
      </el-form-item>
      <el-form-item label="排水量（m³/日）" prop="drainM3">
        <el-input-number :min="0" v-model="itemRuleForm.drainM3" />
      </el-form-item>
      <el-form-item label="排水去向 (道路名称)" prop="drainWay">
        <el-input v-model="itemRuleForm.drainWay" />
      </el-form-item>
      <el-form-item label="有无在线监测装置及检测项目类型" prop="drainType">
        <el-radio-group v-model="itemRuleForm.drainType">
          <el-radio label="是" />
          <el-radio label="否" />
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="$emit('closeDialog')">取消</el-button>
        <el-button type="primary" @click="handle(ruleFormRef)">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from "element-plus";
import type { tableItemModel } from "../models";

const props = defineProps({
  actDialogVisible: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["closeDialog", "addTableData", "setTableData"]);

// 同步 props
const dialogVisible = computed(() => props.actDialogVisible);
const ruleFormRef = ref<FormInstance>();

let dialogTitle = $ref("新增");
let itemIndex = $ref(0);
let itemRuleForm = $ref<tableItemModel>({
  drainNum: "",
  drainMm: 0,
  drainM3: 0,
  drainWay: "",
  drainType: "",
  waterQuality: [
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
  ],
});
const itemRules = reactive<FormRules>({
  drainNum: [{ required: true, message: "请输入排水口编号", trigger: "blur" }],
  drainMm: [
    { required: true, message: "请输入连接管排水管径", trigger: "blur" },
  ],
  drainM3: [{ required: true, message: "请输入排水量", trigger: "blur" }],
  drainWay: [{ required: true, message: "请输入排水去向", trigger: "blur" }],
  drainType: [{ required: true, message: "请选择", trigger: "change" }],
});

const setDialogTitle = (title: string) => {
  dialogTitle = title;
};

const resetForm = () => {
  itemRuleForm = {
    drainNum: "",
    drainMm: 0,
    drainM3: 0,
    drainWay: "",
    drainType: "",
    waterQuality: [
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
    ],
  };
};

const setForm = (index: number, row: tableItemModel) => {
  itemRuleForm = row;
  itemIndex = index;
};

const handleClose = (done: () => void) => {
  emit("closeDialog");

};
const handle = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      if (dialogTitle === "新增") {
        emit("addTableData", itemRuleForm);
      } else {
        emit("setTableData", itemIndex, itemRuleForm);
      }
      emit("closeDialog");
    }
  });
};
defineExpose({
  setDialogTitle,
  resetForm,
  setForm,
});
</script>

<style lang="scss" scoped>
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
