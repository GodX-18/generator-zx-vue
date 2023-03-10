<template>
  <el-dialog
    append-to-body
    v-model="dialogVisible"
    width="30%"
    :before-close="handleClose"
    :show-close="false"
  >
    <template #header>
      <div class="dialogHeader">
        <span>提示</span>
      </div>
    </template>
    <p>您已成功申请</p>
    <p>
      证件编号为
      {{ cardId }}。我们会尽快处理您的申请，请耐心等待，并留意信息提醒。
    </p>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="viewProgress"
          >查看我的进度
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
const emit = defineEmits(["closeDialog"]);
const router = useRouter();

const props = defineProps({
  successDialogVisible: {
    type: Boolean,
    default: false,
  },
  cardId: {
    type: String,
    default: "",
  },
});

const dialogVisible = computed(() => props.successDialogVisible);

const handleClose = () => {
  emit("closeDialog");
};

const viewProgress = () => {
  router.push("/myAppeal");
};
</script>

<style lang="scss" scoped>
.dialogHeader {
  width: 100%;
  height: 40px;
  background: linear-gradient(to right, #7189f9, #2479fa, #6085f9, #2261eb);
  display: flex;
  flex-direction: column;
  justify-content: center;

  span {
    text-indent: 30px;
    font-size: 18px;
    line-height: 42px;
    font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
    font-weight: bold;
    color: #ffffff;
  }
}
</style>
