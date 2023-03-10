<template>
  <Step :active-index="2">
    <el-form
      :disabled="store.isDisabled"
      ref="ruleFormRef"
      label-position="top"
      size="large"
      :model="formLabelAlign"
      :rules="rules"
    >
      <Collapse title="项目信息" desc="请填写项目信息">
        <el-row :gutter="32">
          <el-col :span="12">
            <el-form-item label="是否新建项目" prop="isXjxm">
              <el-radio-group
                @change="newChange($event)"
                v-model="formLabelAlign.isXjxm"
                class="ml-4"
              >
                <el-radio label="Y" size="large">是</el-radio>
                <el-radio label="N" size="large">否</el-radio>
              </el-radio-group>
            </el-form-item></el-col
          >
          <el-col v-if="isNew" :span="12">
            <el-tooltip
              effect="dark"
              content="提示：请选择项目对应的项目编码，未发现匹配的项目请选择“其它”"
              placement="top-start"
            >
              <img
                class="tip"
                src="../../assets/images/steps/tip.png"
                alt=""
              /> </el-tooltip
            ><el-form-item label="项目编码" prop="projectCode">
              <!-- <el-input v-model="formLabelAlign.projectCode" /> -->
              <el-select
                v-model="formLabelAlign.projectCode"
                class="m-2"
                placeholder="请选择"
                size="large"
              >
                <el-option
                  v-for="item in store.enterpriseInfo.xmbm"
                  @click.native="changeItem(item)"
                  :key="item.itemCode"
                  :label="item.label"
                  :value="item.itemCode"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-if="isNew" :span="12">
            <el-form-item label="项目名称" prop="projectName">
              <el-input v-model="formLabelAlign.projectName" /> </el-form-item
          ></el-col>
          <el-col v-if="store.isLive" :span="12">
            <el-tooltip
              effect="dark"
              content="提示：请如实填写施工开始日期和结束日期，排水许可证有效期和施工开始和结束日期一致"
              placement="top-start"
            >
              <img class="tip" src="../../assets/images/steps/tip.png" alt="" />
            </el-tooltip>
            <el-form-item label="施工开始日期" prop="sgStart">
              <el-date-picker
                style="width: 94%"
                v-model="formLabelAlign.sgStart"
                value-format="YYYY-MM-DD"
                type="date"
                placeholder="请选择"
              /> </el-form-item
          ></el-col>
          <el-col v-if="store.isLive" :span="12">
            <el-form-item label="施工结束日期" prop="sgEnd">
              <el-date-picker
                style="width: 94%"
                v-model="formLabelAlign.sgEnd"
                value-format="YYYY-MM-DD"
                type="date"
                placeholder="请选择"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </Collapse>
      <Collapse title="占地面积" desc="请填写占地面积信息">
        <el-row :gutter="32">
          <el-col :span="12">
            <el-form-item label="用地面积（m²）" prop="landArea">
              <el-input
                v-model.number="formLabelAlign.landArea"
                type="text"
              /> </el-form-item
          ></el-col>
          <el-col :span="12"
            ><el-form-item label="总建筑面积（m²）" prop="buildArea">
              <el-input
                v-model.number="formLabelAlign.buildArea"
                type="text"
              /> </el-form-item
          ></el-col>
        </el-row>
        <el-row :gutter="32">
          <el-col :span="12">
            <el-form-item label="生产区面积（m²）" prop="proArea">
              <el-input
                v-model.number="formLabelAlign.proArea"
                type="text"
              /> </el-form-item
          ></el-col>
          <el-col :span="12"
            ><el-form-item label="住宅面积（m²）" prop="houseArea">
              <el-input
                v-model.number="formLabelAlign.houseArea"
                type="text"
              /> </el-form-item
          ></el-col>
        </el-row>
        <el-row :gutter="32">
          <el-col :span="12">
            <el-form-item label="商业面积（m²）" prop="busArea">
              <el-input
                v-model.number="formLabelAlign.busArea"
                type="text"
              /> </el-form-item
          ></el-col>
          <el-col :span="12"
            ><el-form-item label="办公面积（m²）" prop="workArea">
              <el-input
                v-model.number="formLabelAlign.workArea"
                type="text"
              /> </el-form-item
          ></el-col>
        </el-row>
        <el-row :gutter="32">
          <el-col :span="12">
            <el-form-item label="餐饮面积（m²）" prop="caterArea">
              <el-input
                v-model.number="formLabelAlign.caterArea"
              /> </el-form-item
          ></el-col>
        </el-row>
      </Collapse>
    </el-form>
    <div class="btns">
      <div class="primary_btn" @click="preStep">上一步</div>
      <div
        v-if="!store.isDisabled"
        class="common_btn"
        @click="submitForm(ruleFormRef, 'temp')"
      >
        暂存
      </div>
      <div class="primary_btn" @click="submitForm(ruleFormRef, undefined)">
        下一步
      </div>
    </div>
  </Step>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from "element-plus";
import { ElLoading, ElMessage } from "element-plus";
import { next, fetchDatailById } from "@/api/steps";
import Step from "./components/Step.vue";
import Collapse from "./components/Collapse.vue";
import { useUserStore } from "@/stores/user";

const store = useUserStore();
const router = useRouter();

onMounted(async () => {
  window.scrollTo({
    left: 0,
    top: 0,
    behavior: "smooth",
  });
  await getDetails(store.applyId);
  if (!formLabelAlign.landArea && store.ywType !== "add") {
    getDetails(store.oldApplyId);
  }
});

// 表单相关
function changeItem(item: any) {
  formLabelAlign.projectName = item.itemName;
}
async function getDetails(id: string) {
  const { data, success } = await fetchDatailById(id);
  if (success) {
    formLabelAlign = {
      ...data.formdata.detailLists,
      ...data.formdata.drainUser,
    };
  }
}
let formLabelAlign = $ref({
  isXjxm: "",
  projectCode: "",
  projectName: "",
  sgStart: "",
  sgEnd: "",
  landArea: "",
  buildArea: "",
  proArea: "",
  houseArea: "",
  busArea: "",
  workArea: "",
  caterArea: "",
});
const ruleFormRef = ref<FormInstance>();
const rules = reactive<FormRules>({
  isXjxm: [{ required: true, message: "请选择", trigger: "change" }],
  projectCode: [{ required: true, message: "请输入项目编码", trigger: "blur" }],
  projectName: [{ required: true, message: "请输入项目名称", trigger: "blur" }],
  landArea: [
    { required: true, message: "请输入用地面积", trigger: "blur" },
    {
      type: "number",
      message: "请输入数字",
      trigger: "blur",
      transform: (value) => Number(value),
    },
  ],
  buildArea: [
    { required: false, message: "请输入总建筑面积", trigger: "blur" },
    {
      type: "number",
      message: "请输入数字",
      trigger: "blur",
      transform: (value) => Number(value),
    },
  ],
  proArea: [
    { required: false, message: "请输入生产区面积", trigger: "blur" },
    {
      type: "number",
      message: "请输入数字",
      trigger: "blur",
      transform: (value) => Number(value),
    },
  ],
  houseArea: [
    { required: false, message: "请输入住宅面积", trigger: "blur" },
    {
      type: "number",
      message: "请输入数字",
      trigger: "blur",
      transform: (value) => Number(value),
    },
  ],
  busArea: [
    { required: false, message: "请输入商业面积", trigger: "blur" },
    {
      type: "number",
      message: "请输入数字",
      trigger: "blur",
      transform: (value) => Number(value),
    },
  ],
  workArea: [
    { required: false, message: "请输入办公面积", trigger: "blur" },
    {
      type: "number",
      message: "请输入数字",
      trigger: "blur",
      transform: (value) => Number(value),
    },
  ],
  caterArea: [
    { required: false, message: "请输入餐饮面积", trigger: "blur" },
    {
      type: "number",
      message: "请输入数字",
      trigger: "blur",
      transform: (value) => Number(value),
    },
  ],
  sgStart: [
    { required: true, message: "请选择施工开始日期", trigger: "change" },
  ],
  sgEnd: [{ required: true, message: "请选择施工结束日期", trigger: "change" }],
});
const submitForm = async (
  formEl: FormInstance | undefined,
  type: string | undefined
) => {
  if (!formEl) return;
  // if (store.isDisabled) {
  //   router.push("/step3");
  //   return;
  // }
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      store.submitForm = {
        ...store.submitForm,
        detailLists: {
          ...store.submitForm.detailLists,
          isXjxm: formLabelAlign.isXjxm,
          projectCode: formLabelAlign.projectCode,
          projectName: formLabelAlign.projectName,
          sgStart: formLabelAlign.sgStart,
          sgEnd: formLabelAlign.sgEnd,
        },
        drainUser: {
          ...store.submitForm.drainUser,
          ...formLabelAlign,
        },
      };
      const loading = ElLoading.service({
        lock: true,
        text: "Loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      const { success } = await next({
        formdata: store.submitForm,
      });
      loading.close();
      if (success) {
        if (type !== "temp") {
          router.push("/step3");
        } else {
          ElMessage({
            type: "success",
            message: "操作成功！",
          });
        }
      }
    } else {
      console.log("error submit!", fields);
    }
  });
};
let isNew = $ref(true);
function newChange(e: any) {
  isNew = e === "Y";
}
function preStep() {
  router.push("/step1");
}
</script>

<style lang="scss" scoped>
.el-select {
  width: 100%;
}

:deep() {
  .el-input__wrapper {
    width: 100% !important;
  }
  .el-col {
    position: relative;
  }
}
.tip {
  position: absolute;
  right: 20px;
}

.btns {
  display: flex;
  align-items: center;
  justify-content: center;
}
.appeal_btn {
  width: 108px;
  height: 38px;
  line-height: 38px;
  cursor: pointer;
  background: #4286f3;
  text-align: center;
  color: #fff;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  top: 30px;
  margin-bottom: 50px;
}
</style>
