<template>
  <Step :active-index="5">
    <Collapse title="材料上传" desc="请上传材料并盖章">
      <!-- <div class="top">
        <span>您是否为列入重点排污单位名录的排水户</span>
        <span class="need">*</span>
        <el-radio-group v-model="radio" class="ml-4">
          <el-radio label="1" size="large">是</el-radio>
          <el-radio label="2" size="large">否</el-radio>
        </el-radio-group>
      </div> -->
      <el-table
        v-loading="tableLoading"
        :header-cell-style="{
          background: '#f2f8fe',
          height: '46px',
          color: '#062C65',
        }"
        :data="tableData"
        style="width: 100%"
      >
        <el-table-column type="index" width="80" label="序号" />
        <el-table-column prop="fileName" label="材料名称" />
        <el-table-column label="模版">
          <template v-slot="{ row }">
            <span
              style="color: #4286f3; margin-right: 5px"
              v-if="row.sourceFileUrl"
              @click="openUrl(row.sourceFileUrl)"
              >[样表]</span
            >
            <span
              @click="openUrl(row.nullFileUrl)"
              style="color: #4286f3"
              v-if="row.nullFileUrl"
              >[空表]</span
            >
            <span v-if="!row.sourceFileUrl && !row.nullFileUrl">无</span>
          </template>
        </el-table-column>
        <el-table-column prop="sourceFiletype" label="格式" />
        <el-table-column prop="ifNeed" label="必填">
          <template v-slot="{ row }">
            {{ row.ifNeed === "TRUE" ? "是" : "否" }}
          </template>
        </el-table-column>
        <el-table-column prop="fileExplian" label="材料说明" />
        <el-table-column prop="address" label="操作" width="180">
          <template #default="scope">
            <div style="display: flex">
              <el-button
                v-if="
                  [
                    '污水排入城镇排水管网许可申请表',
                    '排水管网及排水水质未发生变化承诺函',
                  ].includes(scope.row.fileName) && store.action !== 'view'
                "
                link
                type="primary"
                @click="autoSign(scope.row)"
                >自动生成并签章</el-button
              >
              <FileUploadAndSign
                style="transform: translateY(5px)"
                v-else-if="uploadState(scope.row)"
                v-bind="fileOptions(scope.row)"
                @refresh="getAttachments"
              />
              <el-button
                v-if="scope.row.isUpload === '上传成功'"
                link
                type="primary"
                @click="doPreview(scope.row)"
                >预览</el-button
              >
            </div>
          </template>
        </el-table-column>
      </el-table>
    </Collapse>
    <div class="btns">
      <div class="primary_btn" @click="preStep">上一步</div>
      <div v-if="store.action !== 'view'" class="primary_btn" @click="submit">
        提交
      </div>
    </div>
  </Step>
  <SuccessDialog
    :successDialogVisible="successDialogVisible"
    :cardId="cardId"
    @closeDialog="closeSuccessDialog"
  />
</template>

<script lang="ts" setup>
import Step from "./components/Step.vue";
import Collapse from "./components/Collapse.vue";
import {
  fetchAttachments,
  submitdrain,
  makeAndUploadSign,
  priew,
} from "@/api/steps";
import { useUserStore } from "@/stores/user";
import FileUploadAndSign from "./components/FileUploadAndSign.vue";
import SuccessDialog from "./components/successDialog.vue";
import { ElMessage } from "element-plus";

const store = useUserStore();
const router = useRouter();
let successDialogVisible = $ref(false);
const closeSuccessDialog = () => {
  successDialogVisible = false;
};

onMounted(async () => {
  window.scrollTo({
    left: 0,
    top: 0,
    behavior: "smooth",
  });
  await getAttachments();
});

//todo 表格相关
let tableData = $ref([]);
let tableLoading = $ref(false);

function uploadState(row: any) {
  return (
    store.action !== "view" &&
    row.fileName !== "有效期内排水证书" &&
    store.ywType !== "delay"
  );
}

async function getAttachments() {
  tableLoading = true;
  const { success, data } = await fetchAttachments({
    applyId: store.applyId,
    deptYwRegNo: store.businessCode,
    oldApplyId: store.oldApplyId,
  });
  tableLoading = false;
  if (success) {
    console.log("GodX------>log", data);
    tableData = data;
  }
}

const autoSign = async (row: any) => {
  let type = "";
  if (row.fileName === "污水排入城镇排水管网许可申请表") {
    type = "sqb";
  } else {
    type = "cnh";
  }
  const { success } = await makeAndUploadSign(store.applyId, type);
  if (success) {
    getAttachments();
    ElMessage({
      type: "success",
      message: "操作成功！",
    });
  }
};
function fileOptions(row: any) {
  return {
    ord: row.ord,
    typeList: [row.sourceFiletype.toLowerCase()],
    idywFile: row.idywFile,
    materialName: row.fileName,
  };
}

//* 预览
function doPreview(item: any) {
  window.open(
    `${
      import.meta.env.VITE_APP_BASE_URL
    }/v2/api/file/previewFile_qyt2?applyId=${store.applyId}&idywFile=${
      item.idywFile
    }&isSign=Y`
  );
}

function openUrl(url: string) {
  window.open(url);
}
function preStep() {
  router.push("/step4");
}

let cardId = $ref("");

// 附件必填校验
function verfiyNeedFiles() {
  const index = tableData.findIndex((item: any) => {
    if (item.ifNeed === "TRUE" && item.isUpload !== "上传成功") {
      ElMessage({
        type: "warning",
        message: `${item.fileName}材料未上传，请提交后再上传`,
      });
      return true;
    }
    return false;
  });
  return new Promise((resolve, reject) => {
    if (index !== -1) {
      reject(new Error("还有未上传的附件！"));
    } else {
      resolve(true);
    }
  });
}
async function submit() {
  await verfiyNeedFiles();
  const { success, data } = await submitdrain({
    applyNo: store.applyId,
  });
  if (success) {
    successDialogVisible = true;
    cardId = data;
  }
}
</script>

<style lang="scss" scoped>
:deep() {
  .el-table tr {
    min-height: 46px;
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
.top {
  height: 54px;
  background: #f4f9fe;
  padding: 10px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  span {
    color: #000000;
  }
  .need {
    color: #ec0707;
    position: relative;
    top: 2px;
    margin: 0 20px 0 5px;
  }
}
.el-table {
  margin-top: 26px;
}
.btns {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
