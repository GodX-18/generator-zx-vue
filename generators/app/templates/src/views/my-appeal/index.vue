<template>
  <h2>我的申报</h2>
  <el-divider />
  <el-form
    :inline="true"
    label-position="left"
    :model="formInline"
    label-suffix=":"
  >
    <el-form-item label="办理类型">
      <el-select clearable v-model="formInline.applyType" placeholder="请选择">
        <el-option
          value="3205900000000010016200001"
          label="核发（首次或重新申请）"
        ></el-option>
        <el-option
          value="3205900000000010016200003"
          label="有效期延期"
        ></el-option>
        <el-option value="3205900000000010016200002" label="变更"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="办理状态">
      <el-select
        clearable
        v-model="formInline.applyStatus"
        placeholder="请选择"
      >
        <el-option value="L" label="草稿件"></el-option>
        <el-option value="H" label="已递交"></el-option>
        <el-option value="24" label="审核中"></el-option>
        <el-option value="5" label="已通过"></el-option>
        <el-option value="R" label="已退回"></el-option>
        <el-option value="J" label="已拒绝"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="申请时间">
      <el-date-picker
        value-format="YYYY-MM-DD"
        style="width: 320px"
        v-model="formInline.date"
        type="daterange"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
      />
    </el-form-item>
  </el-form>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>办件列表</span>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </div>
    </template>
    <el-table
      v-loading="tableLoading"
      :data="tableData"
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column type="index" width="50" />
      <el-table-column prop="no" show-overflow-tooltip label="申请单号" />
      <el-table-column label="办理类型" v-slot="{ row }">
        {{ computeType(row.deptYwRegNo) }}
      </el-table-column>
      <el-table-column prop="wapplyDate" label="申请日期" />
      <el-table-column label="办理类型" width="100" v-slot="{ row }">
        {{ computeState(row.bjStatu) }}
      </el-table-column>
      <el-table-column label="操作" v-slot="{ row }">
        <template v-if="row.bjStatu == 'L'">
          <el-button type="primary" link @click="edit(row.no)">编辑</el-button>
          <el-popconfirm title="确认删除?" @confirm="del(row.no)">
            <template #reference>
              <el-button type="danger" link>删除</el-button>
            </template>
          </el-popconfirm>
        </template>
        <template v-else>
          <el-button type="primary" link @click="view(row.no)">查看</el-button>
          <el-popconfirm
            v-if="row.bjStatu == '5'"
            title="确认下载?"
            @confirm="downLoad(row.no)"
          >
            <template #reference>
              <el-button type="primary" link>证书下载</el-button>
            </template>
          </el-popconfirm>
          <el-popconfirm
            v-else-if="row.bjStatu == 'H'"
            title="确认撤回?"
            @confirm="withdraw(row.no)"
          >
            <template #reference>
              <el-button type="primary" link>撤回</el-button>
            </template>
          </el-popconfirm>
          <el-button
            v-else-if="row.bjStatu == 'R'"
            type="primary"
            link
            @click="reSubmit(row.no)"
            >重新提交</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="float: right; margin: 20px 0"
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      @current-change="handleCurrentChange"
      background
      layout="prev, pager, next,total"
      :total="total"
    />
  </el-card>
</template>

<script lang="ts" setup>
import { fetchAppealList, delAppeal, withdrawAppeal } from "@/api/appeal";
import { useUserStore } from "@/stores/user";
import { ElMessage } from "element-plus";

const store = useUserStore();
const router = useRouter();

onMounted(() => {
  store.oldApplyId = ""
  getAppealList();
});
const formInline = $ref({
  applyType: "",
  applyStatus: "",
  date: "",
});

const computeType = (value: string) => {
  if (value === "3205900000000010016200001") {
    return "核发（首次或重新申请）";
  } else if (value === "3205900000000010016200003") {
    return "有效期延期";
  } else if (value === "3205900000000010016200002") {
    return "变更";
  }
};
const computeState = (v: string) => {
  if (v === "L") {
    return "草稿件";
  } else if (v === "R") {
    return "已退回";
  } else if (v === "H") {
    return "已递交";
  } else if (v === "1") {
    return "已预审";
  } else if (v === "2") {
    return "审核中";
  } else if (v === "3") {
    return "已勘察";
  } else if (v === "4") {
    return "审核中";
  } else if (v === "4.1") {
    return "已打证";
  } else if (v === "4.2") {
    return "已发证";
  } else if (v === "5") {
    return "已通过";
  } else if (v === "J") {
    return "已拒绝";
  } else {
    return "";
  }
};

let tableData = $ref([]);
let tableLoading = $ref(false);
let total = $ref(0);
let currentPage = $ref(1);
let pageSize = $ref(5);

const handleCurrentChange = (val: number) => {
  getAppealList();
};
const getAppealList = async () => {
  tableLoading = true;
  const { applyType, applyStatus, date } = formInline;
  const { data, success } = await fetchAppealList({
    applyEndD: date[1],
    applyNo: "",
    applyStartD: date[0],
    applyStatus,
    applyType,
    deptYwRegNo: "",
    pageNum: currentPage,
    pageSize: 5,
    // pages: 1,
  });
  tableLoading = false;
  if (success) {
    tableData = data.content;
    total = data.recordsTotal;
  }
  console.log("GodX------>log", data);
};

const edit = (no: string) => {
  store.applyId = no;
  store.action = "edit";
  router.push("/step1");
};

const view = (no: string) => {
  store.applyId = no;
  store.action = "view";
  router.push("/step1");
};

const downLoad = (no: string) => {
  window.open(
    `${
      import.meta.env.VITE_APP_BASE_URL
    }/api/file/download_cailiao?no=${no}&type=1`
  );
  window.open(
    `${
      import.meta.env.VITE_APP_BASE_URL
    }/api/file/download_cailiao?no=${no}&type=2`
  );
};
const withdraw = async (no: string) => {
  const { success } = await withdrawAppeal(no);
  if (success) {
    getAppealList();
    ElMessage({
      type: "success",
      message: "撤回成功！",
    });
  }
};

const reSubmit = (no: string) => {
  store.applyId = no;
  router.push("/step1");
};

const del = async (no: string) => {
  const { success } = await delAppeal(no);
  if (success) {
    getAppealList();
    ElMessage({
      type: "success",
      message: "删除成功！",
    });
  }
};

const onSubmit = () => {
  getAppealList();
};
</script>

<style lang="scss" scoped>
:deep() {
  .el-form-item__label {
    display: flex;
    align-items: center;
  }
}
.box-card {
  margin-top: 10px;
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    span {
      font-size: 18px;
      font-weight: bold;
    }
  }
}
</style>
