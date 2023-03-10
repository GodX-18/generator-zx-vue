<template>
  <Step :active-index="4">
    <Collapse title="排水管网情况">
      <span class="tip" v-show="!ifEqual"
        >提示：总排水量和排水户信息页面输入的总排水量不一致，请仔细检查后重新输入</span
      >
      <BgTitle title="排水官网列表">
        <el-table
          :header-cell-style="{
            background: '#dfeef8',
            height: '76px',
            color: '#062C65',
          }"
          :data="tableData"
          style="width: 100%"
        >
          <el-table-column type="index" width="80" label="序号" />
          <el-table-column prop="drainNum" label="排水口编号" />
          <el-table-column prop="drainMm" label="连接管排水 管径（mm）" />
          <el-table-column prop="drainM3" label="排水量（m³/日）" />
          <el-table-column prop="drainWay" label="排水去向 (道路名称)" />
          <el-table-column
            prop="drainType"
            label="有无在线监测装置及检测项目类型"
          />
          <el-table-column
            prop="address"
            fixed="right"
            label="操作"
            width="180"
          >
            <template #default="scope">
              <el-button
                link
                type="primary"
                @click="editWater(scope.$index, scope.row.waterQuality)"
                >水质信息</el-button
              >
              <el-button
                v-if="!store.isDisabled"
                link
                type="primary"
                @click="edit(scope.$index, scope.row)"
                >编辑</el-button
              >
              <el-button
                v-if="!store.isDisabled"
                link
                type="primary"
                @click="delItem(scope.$index)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <div v-if="!store.isDisabled" class="addItem" @click="addItem">
          <el-icon color="#2f72f7" :size="24"><Plus /></el-icon>
          <span>新增编号</span>
        </div>
      </BgTitle>
      <BgTitle title="排水管网平面示意图">
        <el-form
          :disabled="store.isDisabled"
          ref="ruleFormRef"
          label-position="top"
          :model="formLabelAlign"
          :rules="rules"
        >
          <el-row :gutter="32">
            <el-col :span="24">
              <el-form-item label="上传附件" prop="image">
                <el-upload
                  class="avatar-uploader"
                  v-model:file-list="fileList"
                  :action="`${baseUrl}/api/file/upload_qyt`"
                  list-type="picture"
                  :before-upload="beforeAvatarUpload"
                  :on-remove="handleRemove"
                  :on-success="handleSuccess"
                  :on-preview="handlePreview"
                  :limit="1"
                  :disabled="store.isDisabled"
                  multiple
                  :on-exceed="handleExceed"
                >
                  <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                  <el-icon v-else class="avatar-uploader-icon"
                    ><Plus
                  /></el-icon>
                  <template #tip>
                    <div class="el-upload__tip">
                      只能上传jpg/png文件，且不超过4M
                    </div>
                  </template>
                </el-upload>
              </el-form-item></el-col
            >
          </el-row>
          <el-row :gutter="32">
            <el-col :span="24">
              <el-form-item label="备注">
                <el-input
                  v-model="formLabelAlign.remark"
                  :rows="3"
                  maxlength="200"
                  type="textarea"
                  placeholder="200字以内"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </BgTitle>
    </Collapse>
    <div class="btns">
      <div class="primary_btn" @click="preStep">上一步</div>
      <div
        v-loading="submitLoading"
        class="common_btn"
        v-if="ifEqual"
        @click="submitForm(ruleFormRef)"
      >
        {{ store.ywType === "delay" ? "下一步" : "暂存并上传申报材料" }}
      </div>
      <div class="common_btn" v-else-if="store.isDisabled" @click="next">
        下一步
      </div>
    </div>
  </Step>
  <act-dialog
    ref="actDialogRef"
    :actDialogVisible="actDialogVisible"
    @closeDialog="closeActDialog"
    @addTableData="addTableData"
    @setTableData="setTableData"
  ></act-dialog>
  <water-dialog
    ref="waterDiologRef"
    :waterDialogVisible="waterDialogVisible"
    @closeDialog="closeWaterDialog"
    @setTableWater="setTableWater"
  ></water-dialog>
</template>

<script lang="ts" setup>
import Step from "./components/Step.vue";
import ActDialog from "./components/actDialog.vue";
import waterDialog from "./components/waterDialog.vue";
import Collapse from "./components/Collapse.vue";
import BgTitle from "./components/BgTitle.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  fetchOnlineManage,
  saveOnlineManage,
  fetchImages,
  saveWaterQuailty,
  fetchWaterQuailty,
} from "@/api/steps";
import { useUserStore } from "@/stores/user";
import type {
  UploadProps,
  FormInstance,
  FormRules,
  UploadRawFile,
} from "element-plus";
import type { tableItemModel, waterModel } from "./models";

type ActDialogCtx = InstanceType<typeof ActDialog>;
type WaterDialogCtx = InstanceType<typeof waterDialog>;

const store = useUserStore();
const baseUrl = import.meta.env.VITE_APP_BASE_URL;
const ruleFormRef = ref<FormInstance>();

onMounted(async () => {
  window.scrollTo({
    left: 0,
    top: 0,
    behavior: "smooth",
  });
  showImages();
  await getOnlineManage(store.applyId);
  if (!tableData.length && store.ywType !== "add") {
    await getOnlineManage(store.oldApplyId);
  }
  await getWaterQuailty(store.applyId);
  if (!temp.length && store.ywType !== "add") {
    await getWaterQuailty(store.oldApplyId);
  }
});

let imageName = $ref("");
let submitLoading = $ref(false);

async function showImages() {
  const { data, success } = await fetchImages(store.applyId);
  if (success) {
    data.images && (fileList = [{ url: data.images, name: imageName }]);
  }
}

let temp = [];
async function getWaterQuailty(id: string) {
  const { success, data } = await fetchWaterQuailty(id);
  if (success) {
    temp = data.list;
    const waterArr = data.list.reduce((acc: any[], current: any) => {
      const keys = acc.map((item) => item.drainNum);
      const index = acc.findIndex((item) => item.drainNum === current.drainNum);
      if (keys.includes(current.drainNum)) {
        acc[index].waterQuality.push({
          label: current.proName,
          value: current.drainMg,
        });
      } else {
        acc.push({
          drainNum: current.drainNum,
          waterQuality: [
            {
              label: current.proName,
              value: current.drainMg,
            },
          ],
        });
      }
      return acc;
    }, []);
    tableData.forEach((item) => {
      const i = waterArr.findIndex((j: any) => item.drainNum === j.drainNum);
      item.waterQuality = waterArr[i].waterQuality;
    });
  }
}
function next() {
  router.push("/step5");
}

//todo 弹框相关
let actDialogVisible = $ref(false);
const actDialogRef = $ref<ActDialogCtx | null>(null);

let waterDialogVisible = $ref(false);
const waterDiologRef = $ref<WaterDialogCtx | null>(null);

const closeActDialog = () => {
  actDialogVisible = false;
};

const closeWaterDialog = () => {
  waterDialogVisible = false;
};

const addTableData = (row: tableItemModel) => {
  tableData.push(row);
};
const setTableData = (index: number, row: tableItemModel) => {
  tableData[index] = row;
};
const setTableWater = (index: number, row: waterModel[]) => {
  tableData[index]["waterQuality"] = row;
};
const edit = (index: number, row: tableItemModel) => {
  if (actDialogRef) {
    actDialogRef.setForm(index, row);
    actDialogRef.setDialogTitle("编辑");
    actDialogVisible = true;
  }
};

//todo 表格相关
let tableData = $ref<any[]>([]);
let ifEqual = $ref(false);
watch(
  () => tableData,
  (newValue) => {
    const total = newValue.reduce((acc, current) => {
      acc += Number(current.drainM3);
      return acc;
    }, 0);
    ifEqual = total === Number(store.submitForm.drainInfo.sumDrain);
  },
  {
    deep: true,
  }
);
const editWater = (index: number, row: waterModel[]) => {
  waterDiologRef && waterDiologRef.setForm(index, row);
  waterDialogVisible = true;
};
const delItem = (index: number) => {
  ElMessageBox.confirm("此操作将永久删除该编号，是否继续?", "删除", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      tableData.splice(index, 1);
      ElMessage({
        type: "success",
        message: "删除成功",
      });
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "操作取消",
      });
    });
};
const addItem = () => {
  if (actDialogRef) {
    actDialogRef.setDialogTitle("新增");
    actDialogRef.resetForm();
    actDialogVisible = true;
  }
};

async function getOnlineManage(id: string) {
  const { data, success } = await fetchOnlineManage(id);
  if (success) {
    tableData = data.data.detailLists.map((item: any) => ({
      ...item,
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
    }));
    imageName = data.data.uploadIndex1?.split(" ")[0] || "";
    formLabelAlign.remark = data.data.remark;
    formLabelAlign.image = data.data.image;
  }
}

const rules = reactive<FormRules>({
  image: [{ required: true, message: "请上传附件", trigger: "change" }],
});

const router = useRouter();

const formLabelAlign = reactive({
  image: "",
  remark: "",
});
// 上传相关

const imageUrl = ref("");
let fileList = $ref<any>([]);

function preStep() {
  router.push("/step3");
}

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      submitLoading = true;
      let formData = new FormData();
      formData.append("remark", formLabelAlign.remark);
      formData.append("applyNo", store.applyId);
      formData.append("image", formLabelAlign.image);
      formData.append("detailListsStr", JSON.stringify(tableData));
      const { success } = await saveOnlineManage(formData);
      if (success) {
        let paramArr = tableData.reduce((acc, current) => {
          const res = current.waterQuality.map((item: any) => ({
            applyNo: store.applyId,
            drainMg: item.value,
            drainNum: current.drainNum,
            proName: item.label,
          }));
          acc.push(...res);
          return acc;
        }, []);
        const { success } = await saveWaterQuailty(paramArr);
        submitLoading = false;
        if (success) {
          router.push("/step5");
        }
      }
    } else {
      console.log("error submit!", fields);
    }
  });
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
function beforeAvatarUpload(file: UploadRawFile) {
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
const handleRemove: UploadProps["onRemove"] = () => {
  formLabelAlign.image = "";
};

const handleSuccess: UploadProps["onSuccess"] = (response) => {
  attachListF(response);
};

const handleExceed: UploadProps["onExceed"] = (files, fileList) => {
  ElMessage({
    type: "warning",
    message: `当前限制选择 1 个文件，本次选择了 ${
      files.length
    } 个文件，共选择了 ${files.length + fileList.length} 个文件`,
  });
};
function attachListF(res: any) {
  if (res.success) {
    formLabelAlign.image = res.data.no;
  } else {
    ElMessage({
      type: "error",
      message: "附件上传失败!",
    });
  }
}
</script>

<style lang="scss" scoped>
:deep() {
  .el-table tr {
    height: 46px;
    font-size: 16px;
    cursor: pointer;
  }
  .el-table--striped .el-table__body tr.el-table__row--striped.current-row td,
  .el-table__body tr.current-row > td {
    color: #fff;
    background-color: #a2a4a7 !important;
  }

  .el-table tr:nth-child(even) {
    background: #fafafa;
  }
  .el-table tr:nth-child(odd) {
    background-color: #fff;
  }
  .el-table td,
  .el-table th.is-leaf {
    border: 0px;
  }
  .el-tag {
    width: 157px;
    height: 51px;
    line-height: 51px;
    text-align: center;
    font-size: 16px;
  }
}
.tip {
  position: absolute;
  right: 20px;
  top: 70px;
  font-size: 16px;
  color: #b80b0b;
}
.btns {
  display: flex;
  align-items: center;
  justify-content: center;
}
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

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
