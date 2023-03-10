<template>
  <Step :active-index="3">
    <el-form
      :disabled="store.isDisabled"
      ref="ruleFormRef"
      label-position="top"
      size="large"
      :model="formLabelAlign"
      :rules="rules"
    >
      <Collapse title="排水户信息" desc="请填写排水户信息">
        <el-row :gutter="32">
          <el-col :span="12">
            <el-form-item label="排水户地址" prop="drainAddr">
              <el-input
                @blur="searchArea"
                v-loading="areaLoading"
                v-model="formLabelAlign.drainAddr"
              >
                <template #append>
                  <span style="cursor: pointer" @click="searchArea"
                    >匹配所属区域</span
                  >
                </template></el-input
              >
            </el-form-item></el-col
          >
          <el-col :span="12">
            <el-form-item label="所属区域" prop="areaName">
              <!-- <el-input
                v-model="formLabelAlign.areaName"
              ></el-input> -->
              <el-select
                v-model="formLabelAlign.areaName"
                class="m-2"
                placeholder="请选择"
                size="large"
              >
                <el-option
                  v-for="item in areaList"
                  :key="item.label"
                  :label="item.label"
                  :value="item.label"
                />
              </el-select> </el-form-item
          ></el-col>
        </el-row>
        <el-row :gutter="32">
          <el-col :span="24">
            <el-form-item label="排水户业务类型" prop="ywType">
              <el-select v-model="formLabelAlign.ywType" placeholder="请选择">
                <el-option
                  v-for="item in ywTypes"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select> </el-form-item
          ></el-col>
        </el-row>
      </Collapse>
      <Collapse title="排水信息（m³/日）" desc="请填写排水信息">
        <BgTitle title="用水信息">
          <el-row :gutter="32">
            <el-col :span="8">
              <el-form-item label="总用水量" prop="sumWater">
                <el-input
                  v-model.number="formLabelAlign.sumWater"
                /> </el-form-item
            ></el-col>
            <el-col :span="8"
              ><el-form-item label="其中自来水量" prop="sumCityWater">
                <el-input
                  v-model.number="formLabelAlign.sumCityWater"
                /> </el-form-item
            ></el-col>
            <el-col :span="8"
              ><el-form-item label="其中自备水量" prop="sumSelfWater">
                <el-input
                  v-model.number="formLabelAlign.sumSelfWater"
                /> </el-form-item
            ></el-col>
          </el-row>
        </BgTitle>
        <BgTitle title="排水信息">
          <el-row :gutter="32">
            <el-col :span="8">
              <el-form-item label="总排水量" prop="sumDrain">
                <el-input
                  v-model.number="formLabelAlign.sumDrain"
                /> </el-form-item
            ></el-col>
            <el-col :span="8"
              ><el-form-item
                label="其中生产（含餐饮）污水量"
                prop="sumProWater"
              >
                <el-input
                  v-model.number="formLabelAlign.sumProWater"
                /> </el-form-item
            ></el-col>
            <el-col :span="8"
              ><el-form-item label="其中生活污水量" prop="sumLiveWaste">
                <el-input
                  v-model.number="formLabelAlign.sumLiveWaste"
                /> </el-form-item
            ></el-col>
          </el-row>
        </BgTitle>
        <BgTitle title="预处理信息">
          <el-row :gutter="32">
            <el-col :span="24">
              <el-form-item label="预处理方式" prop="processWay">
                <el-radio-group
                  v-model="formLabelAlign.processWay"
                  class="ml-4"
                >
                  <el-radio label="1" size="large">自行处理</el-radio>
                  <el-radio label="2" size="large">委托处理</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="32">
            <el-col :span="24">
              <el-form-item label="预处理工艺" prop="processTech">
                <el-input
                  v-model="formLabelAlign.processTech"
                  :rows="3"
                  maxlength="300"
                  type="textarea"
                  placeholder="300字以内"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="32">
            <el-col :span="24">
              <el-form-item label="主要产品和服务" prop="proService">
                <el-input
                  v-model="formLabelAlign.proService"
                  :rows="3"
                  maxlength="300"
                  type="textarea"
                  placeholder="300字以内"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="32">
            <el-col :span="24">
              <el-form-item label="主要原料" prop="material">
                <el-input
                  v-model="formLabelAlign.material"
                  :rows="3"
                  maxlength="300"
                  type="textarea"
                  placeholder="300字以内"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="32">
            <el-col :span="24">
              <el-form-item label="污水预处理工艺流程" prop="wasterWayRemark">
                <el-input
                  v-model="formLabelAlign.wasterWayRemark"
                  :rows="3"
                  maxlength="300"
                  type="textarea"
                  placeholder="300字以内"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-upload
            v-model:file-list="fileList1"
            :action="`${baseUrl}/api/file/upload_qyt`"
            :before-upload="(file) => beforeAvatarUpload(file, 'uploadIndex1')"
            :on-remove="handleRemove1"
            :on-success="handleSuccess1"
            :on-preview="handlePreview"
            list-type="picture"
            :limit="1"
            multiple
            :on-exceed="handleExceed"
          >
            <!-- <div class="upload_btn">上传图片</div> -->
            <el-button type="primary" :disabled="store.isDisabled"
              >上传图片</el-button
            >
            <template #tip>
              <div class="el-upload__tip">只能上传jpg/png文件，且不超过4M</div>
            </template>
          </el-upload>
          <el-row :gutter="32">
            <el-col :span="24">
              <el-form-item
                label="主要生产工艺及水污染物产生流程"
                prop="proWayRemark"
              >
                <el-input
                  v-model="formLabelAlign.proWayRemark"
                  :rows="3"
                  maxlength="300"
                  type="textarea"
                  placeholder="300字以内"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-upload
            v-model:file-list="fileList2"
            class="upload-demo"
            :action="`${baseUrl}/api/file/upload_qyt`"
            :before-upload="(file) => beforeAvatarUpload(file, 'uploadIndex2')"
            :on-remove="handleRemove2"
            :on-success="handleSuccess2"
            :on-preview="handlePreview"
            list-type="picture"
            :limit="1"
            multiple
            :on-exceed="handleExceed"
          >
            <el-button type="primary" :disabled="store.isDisabled"
              >上传图片</el-button
            >
            <template #tip>
              <div class="el-upload__tip">只能上传jpg/png文件，且不超过4M</div>
            </template>
          </el-upload>
          <el-row :gutter="32">
            <el-col :span="24">
              <el-form-item label="备注">
                <el-input
                  v-model="formLabelAlign.remark"
                  :rows="3"
                  maxlength="300"
                  type="textarea"
                  placeholder="300字以内"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </BgTitle>
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
import type {
  FormInstance,
  FormRules,
  UploadProps,
  UploadRawFile,
} from "element-plus";
import { ElLoading, ElMessage } from "element-plus";
import { next, fetchDatailById, fetchImages } from "@/api/steps";
import { useUserStore } from "@/stores/user";

import Step from "./components/Step.vue";
import Collapse from "./components/Collapse.vue";
import BgTitle from "./components/BgTitle.vue";
import { getArea } from "@/utils/index";

const router = useRouter();
const route = useRoute();
const store = useUserStore();
const baseUrl = import.meta.env.VITE_APP_BASE_URL;

const areaList = [
  {
    label: "阳澄湖半岛旅游度假区",
  },
  {
    label: "金鸡湖中央商务区",
  },
  {
    label: "独墅湖科教创新区",
  },
  {
    label: "高端制造与国际贸易区",
  },
];

onMounted(async () => {
  window.scrollTo({
    left: 0,
    top: 0,
    behavior: "smooth",
  });
  showImages();
  await getDetails(store.applyId);
  if (!formLabelAlign.drainAddr && store.ywType !== "add") {
    getDetails(store.oldApplyId);
  }
});

async function getDetails(id: string) {
  const { data, success } = await fetchDatailById(id);
  if (success) {
    formLabelAlign = {
      ...data.formdata.detailLists,
      ...data.formdata.drainUser,
      ...data.formdata.drainInfo,
    };
  }
}

async function showImages() {
  const { data, success } = await fetchImages(store.applyId);
  if (success) {
    data.proWays &&
      (fileList1 = [{ url: data.proWays, name: formLabelAlign.uploadIndex1 }]);
    data.wasterWays &&
      (fileList2 = [
        { url: data.wasterWays, name: formLabelAlign.uploadIndex2 },
      ]);
  }
}
// 表单相关
let areaLoading = $ref(false);
const ywTypes = readonly([
  {
    value: "一类",
    label: "生活污水排放类，包括机关事业单位、学校、商场、浴场等排水",
  },
  {
    value: "二类",
    label: "餐饮污水排放类，包括宾馆、酒店、各类饮食等排水户",
  },
  {
    value: "三类",
    label:
      "浓度较高、含杂质物较多的污水排放类，包括公共场所、垃圾中转站、粪便处理厂和农贸市场",
  },
  {
    value: "四类",
    label: "含有沉淀物排放类，包括从事机动车清洗、建设工程施工等排水户",
  },
  {
    value: "五类",
    label:
      "有毒有害污水排放类，包括排放医疗机构污水的各类医疗机构和排放产业废水的厂矿企业",
  },
]);
let fileList1 = $ref<any>([]);
let fileList2 = $ref<any>([]);
let formLabelAlign = $ref<any>({
  drainAddr: "",
  areaName: "",
  ywType: "",
  sumWater: "",
  sumCityWater: "",
  sumSelfWater: "",
  sumDrain: "",
  sumProWater: "",
  sumLiveWaste: "",
  processWay: "",
  processTech: "",
  proService: "",
  material: "",
  wasterWayRemark: "",
  proWayRemark: "",
  remark: "",
  proWay: "",
  wasterWay: "",
});
const ruleFormRef = ref<FormInstance>();
const rules = reactive<FormRules>({
  drainAddr: [{ required: true, message: "请输入排水户地址", trigger: "blur" }],
  areaName: [{ required: true, message: "请输入所属区域", trigger: "blur" }],
  ywType: [
    { required: true, message: "请选择排水户业务类型", trigger: "change" },
  ],
  sumWater: [
    {
      required: true,
      message: "请输入总用水量",
      trigger: "blur",
    },
    {
      type: "number",
      message: "请输入数字",
      trigger: "blur",
      transform: (value) => Number(value),
    },
  ],
  sumCityWater: [
    {
      required: false,
      message: "请输入其中自来水量",
      trigger: "blur",
    },
    {
      type: "number",
      message: "请输入数字",
      trigger: "blur",
      transform: (value) => Number(value),
    },
  ],
  sumSelfWater: [
    {
      required: false,
      message: "请输入自备水量",
      trigger: "blur",
    },
    {
      type: "number",
      message: "请输入数字",
      trigger: "blur",
      transform: (value) => Number(value),
    },
  ],
  sumDrain: [
    {
      required: true,
      message: "请输入总排水量",
      trigger: "blur",
    },
    {
      type: "number",
      message: "请输入数字",
      trigger: "blur",
      transform: (value) => Number(value),
    },
  ],
  sumProWater: [
    {
      required: false,
      message: "请输入其中生产（含餐饮）污水量",
      trigger: "blur",
    },
    {
      type: "number",
      message: "请输入数字",
      trigger: "blur",
      transform: (value) => Number(value),
    },
  ],
  sumLiveWaste: [
    {
      required: false,
      message: "请输入其中生活污水量",
      trigger: "blur",
    },
    {
      type: "number",
      message: "请输入数字",
      trigger: "blur",
      transform: (value) => Number(value),
    },
  ],
  processWay: [
    { required: true, message: "请选择预处理方式", trigger: "change" },
  ],
  processTech: [
    { required: true, message: "请输入预处理工艺", trigger: "blur" },
  ],
  proService: [
    { required: true, message: "请输入主要产品和服务", trigger: "blur" },
  ],
  material: [{ required: true, message: "请输入主要原料", trigger: "blur" }],
  wasterWayRemark: [
    { required: false, message: "请输入污水预处理工艺流程", trigger: "blur" },
  ],
  proWayRemark: [
    {
      required: false,
      message: "请输入主要生产工艺及水污染物产生流程",
      trigger: "blur",
    },
  ],
});

const submitForm = async (
  formEl: FormInstance | undefined,
  type: string | undefined
) => {
  if (!formEl) return;
  // if (store.isDisabled) {
  //   router.push("/step4");
  //   return;
  // }
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      const loading = ElLoading.service({
        lock: true,
        text: "Loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      store.submitForm = {
        ...store.submitForm,
        drainUser: {
          ...store.submitForm.drainUser,
          drainAddr: formLabelAlign.drainAddr,
          areaName: formLabelAlign.areaName,
          ywType: formLabelAlign.ywType,
          processTech: formLabelAlign.processTech,
          proService: formLabelAlign.proService,
          material: formLabelAlign.material,
          wasterWayRemark: formLabelAlign.wasterWayRemark,
          proWayRemark: formLabelAlign.proWayRemark,
          remark: formLabelAlign.remark,
          proWay: formLabelAlign.proWay,
          wasterWay: formLabelAlign.wasterWay,
          uploadIndex1: formLabelAlign.uploadIndex1,
          uploadIndex2: formLabelAlign.uploadIndex2,
        },
        drainInfo: formLabelAlign,
      };
      const { success } = await next({
        formdata: store.submitForm,
      });
      loading.close();
      if (success) {
        if (type !== "temp") {
          router.push("/step4");
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

function preStep() {
  router.push("/step2");
}

const searchArea = async () => {
  if (!formLabelAlign.drainAddr) return;
  areaLoading = true;
  const area = await getArea(formLabelAlign.drainAddr);
  areaLoading = false;
  formLabelAlign.areaName = area || "";
};
// 文件上传
function handlePreview(file: any) {
  var a = document.createElement("a");
  a.style.display = "none";
  a.href = file.url;
  a.download = file.name;
  document.body.appendChild(a);
  a.click();
  //移除元素
  document.body.removeChild(a);
}
function beforeAvatarUpload(file: UploadRawFile, key: string) {
  formLabelAlign[key] = file.name;
  const isJPG = file.type.indexOf("image") !== -1;
  const isLt2M = file.size / 1024 / 1024 < 4;
  if (!isJPG) {
    ElMessage({
      type: "error",
      message: "只能上传图片格式!",
    });
  }
  if (!isLt2M) {
    ElMessage({
      type: "error",
      message: "上传图片大小不能超过 4M!",
    });
  }
  return isJPG && isLt2M;
}
const handleRemove1: UploadProps["onRemove"] = () => {
  formLabelAlign.proWay = "";
};
const handleRemove2: UploadProps["onRemove"] = () => {
  formLabelAlign.wasterWay = "";
};

const handleSuccess1: UploadProps["onSuccess"] = (response) => {
  attachListF1(response);
};
const handleSuccess2: UploadProps["onSuccess"] = (response) => {
  attachListF2(response);
};
const handleExceed: UploadProps["onExceed"] = (files, fileList) => {
  ElMessage({
    type: "warning",
    message: `当前限制选择 1 个文件，本次选择了 ${
      files.length
    } 个文件，共选择了 ${files.length + fileList.length} 个文件`,
  });
};
function attachListF1(res: any) {
  console.log("GodX------>log", res);
  if (res.success) {
    formLabelAlign.proWay = res.data.no;
  } else {
    ElMessage({
      type: "error",
      message: "附件上传失败!",
    });
  }
}
function attachListF2(res: any) {
  if (res.success) {
    formLabelAlign.wasterWay = res.data.no;
  } else {
    ElMessage({
      type: "error",
      message: "附件上传失败!",
    });
  }
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
  .el-upload-list {
    position: relative;
    top: -30px;
  }
}

.btns {
  display: flex;
  align-items: center;
  justify-content: center;
}

.el-upload__tip {
  font-size: 16px;
  font-family: MicrosoftYaHei;
  color: rgba(0, 0, 0, 0.3);
  position: relative;
  top: -40px;
  left: 110px;
}
</style>
