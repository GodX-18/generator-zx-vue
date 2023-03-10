<template>
  <Step :active-index="1">
    <el-form
      :disabled="store.isDisabled"
      ref="ruleFormRef"
      label-position="top"
      size="large"
      :model="formLabelAlign"
      :rules="rules"
    >
      <Collapse title="企业信息" desc="请填写企业基本信息">
        <el-row :gutter="32">
          <el-col :span="12">
            <el-form-item label="申请单位" prop="applicantName">
              <el-input
                :disabled="true"
                v-model="formLabelAlign.applicantName"
              /> </el-form-item
          ></el-col>
          <el-col :span="12"
            ><el-form-item label="单位地址" prop="applicantAddress">
              <el-input
                v-model="formLabelAlign.applicantAddress"
              /> </el-form-item
          ></el-col>
        </el-row>
        <el-row :gutter="32">
          <el-col :span="12">
            <el-form-item label="统一社会信用代码" prop="applicantCode">
              <el-input
                :disabled="true"
                v-model="formLabelAlign.applicantCode"
              /> </el-form-item
          ></el-col>
          <el-col :span="12"
            ><el-form-item label="法定代表人姓名" prop="operManName">
              <el-input
                :disabled="true"
                v-model="formLabelAlign.operManName"
              /> </el-form-item
          ></el-col>
        </el-row>
        <el-row :gutter="32">
          <el-col :span="12">
            <el-form-item label="法定代表人证件类型" prop="applicantPaperType">
              <el-select
                v-model="formLabelAlign.applicantPaperType"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in certificates"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12"
            ><el-form-item label="法定代表人证件号码" prop="applicantPaperCode">
              <el-input
                v-model="formLabelAlign.applicantPaperCode"
              /> </el-form-item
          ></el-col>
        </el-row>
        <el-row :gutter="32">
          <el-col :span="12">
            <el-form-item label="法定代表人手机" prop="applicantMobile">
              <el-input
                v-model="formLabelAlign.applicantMobile"
              /> </el-form-item
          ></el-col>
        </el-row>
      </Collapse>
      <Collapse title="经办人信息" desc="请填写经办人信息">
        <el-row :gutter="32">
          <el-col :span="12">
            <el-form-item label="经办人姓名" prop="linkmanName">
              <el-input v-model="formLabelAlign.linkmanName" /> </el-form-item
          ></el-col>
          <el-col :span="12"
            ><el-form-item label="经办人手机" prop="linkmanMobile">
              <el-input v-model="formLabelAlign.linkmanMobile" /> </el-form-item
          ></el-col>
        </el-row>
        <el-row :gutter="32">
          <el-col :span="12">
            <el-form-item label="经办人证件类型" prop="linkmanPaperType">
              <el-select
                v-model="formLabelAlign.linkmanPaperType"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in certificates"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select> </el-form-item
          ></el-col>
          <el-col :span="12"
            ><el-form-item
              label="经办人证件号码"
              :prop="
                formLabelAlign.linkmanPaperType === '0'
                  ? 'linkmanPaperCode'
                  : ''
              "
            >
              <el-input
                v-model="formLabelAlign.linkmanPaperCode"
              /> </el-form-item
          ></el-col>
        </el-row>
      </Collapse>
    </el-form>
    <div
      class="appeal_btn primary_btn"
      v-loading="loading"
      @click="submitForm(ruleFormRef)"
    >
      下一步
    </div>
  </Step>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from "element-plus";
import { ElLoading } from "element-plus";

import { useUserStore } from "@/stores/user";

import Step from "./components/Step.vue";
import Collapse from "./components/Collapse.vue";
import { next, fetchDatailById } from "@/api/steps";
import { checkCardId } from "@/utils/validate";

const store = useUserStore();
const router = useRouter();
let loading = $ref(false);
onMounted(async () => {
  window.scrollTo({
    left: 0,
    top: 0,
    behavior: "smooth",
  });
  await getDetailById(store.applyId);
  if (!formLabelAlign.applicantAddress && store.ywType !== "add") {
    // store.$patch((state) => {
    //   state.submitForm.detailLists.applyId = store.applyId;
    // });
    getDetailById(store.oldApplyId);
  }
});

// 表单相关

async function getDetailById(id: string) {
  const loading = ElLoading.service({
    lock: true,
    text: "Loading",
    background: "rgba(0, 0, 0, 0.7)",
  });
  const { data, success } = await fetchDatailById(id);
  loading.close();
  if (success) {
    if (data.formdata.detailLists.applyId) {
      formLabelAlign = data.formdata.detailLists;
      store.submitForm = data.formdata;
    } else {
      // 企业信息回显
      formLabelAlign.applicantName = store.enterpriseInfo?.corname || "";
      formLabelAlign.applicantCode = store.enterpriseInfo?.cornumber || "";
      formLabelAlign.operManName = store.enterpriseInfo?.corusername || "";
      formLabelAlign.applicantPaperCode =
        store.enterpriseInfo?.corusercardid || "";
      formLabelAlign.applicantMobile =
        store.enterpriseInfo?.corusermobile || "";
      formLabelAlign.applicantAddress = store.enterpriseInfo?.regaddress || "";
      // 经办人信息回显
      formLabelAlign.linkmanName = store.enterpriseInfo?.name || "";
      formLabelAlign.linkmanMobile = store.enterpriseInfo?.mobile || "";
      formLabelAlign.linkmanPaperCode = store.enterpriseInfo?.cardid || "";
    }
  }
}
let formLabelAlign = $ref({
  applyId: store.applyId,
  applicantName: "",
  applicantAddress: "",
  applicantCode: "",
  operManName: "",
  applicantPaperType: "0",
  applicantMobile: "",
  applicantPaperCode: "",
  linkmanMobile: "",
  linkmanName: "",
  linkmanPaperType: "0",
  linkmanPaperCode: "",
});
const certificates = [
  {
    value: "0",
    label: "身份证",
  },
  {
    value: "1",
    label: "护照",
  },
  {
    value: "10",
    label: "驾驶证",
  },
  {
    value: "4",
    label: "军官证",
  },
];
const ruleFormRef = ref<FormInstance>();
const rules = reactive<FormRules>({
  applicantName: [
    { required: true, message: "请输入申请单位", trigger: "blur" },
  ],
  applicantAddress: [
    { required: true, message: "请输入单位地址", trigger: "blur" },
  ],
  operManName: [{ required: true, message: "请输入法人姓名", trigger: "blur" }],
  applicantMobile: [
    { required: true, message: "请输入法定代表人手机", trigger: "blur" },
    {
      pattern: /^[1][3,4,5,7,8][0-9]{9}$/,
      message: "请輸入正确的格式",
      trigger: "blur",
    },
  ],
  applicantPaperCode: [
    { required: true, message: "请输入法定代表人证件号码", trigger: "blur" },
  ],
  linkmanName: [
    { required: true, message: "请输入经办人姓名", trigger: "blur" },
  ],
  linkmanMobile: [
    { required: true, message: "请输入经办人手机", trigger: "blur" },
    {
      pattern: /^[1][3,4,5,7,8][0-9]{9}$/,
      message: "请輸入正确的格式",
      trigger: "blur",
    },
  ],
  linkmanPaperType: [
    { required: true, message: "请选择经办人证件类型", trigger: "change" },
  ],
  applicantPaperType: [
    { required: true, message: "请选择法定代表人证件类型", trigger: "change" },
  ],
  linkmanPaperCode: [
    { required: true, message: "请输入经办人证件号码", trigger: "blur" },
    { validator: checkCardId, trigger: "blur" },
  ],
});
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      store.submitForm.detailLists = {
        ...store.submitForm.detailLists,
        ...formLabelAlign,
        applyId: store.applyId,
        yeName: store.businessName,
        deptYwRegNo: store.businessCode,
      };
      loading = true;
      const { success } = await next({
        formdata: store.submitForm,
      });
      loading = false;
      if (success) {
        router.push("/step2");
      }
    } else {
      console.log("error submit!", fields);
    }
  });
};
</script>

<style lang="scss" scoped>
.el-select {
  width: 100%;
}
.appeal_btn {
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  top: 30px;
  margin-bottom: 50px;
}
</style>
