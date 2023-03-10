<template>
  <div>
    <el-upload
      v-model:file-list="fileList"
      class="upload-demo"
      :action="action"
      v-loading="loading"
      :before-upload="beforeUpload"
      :limit="1"
      :accept="'.' + props.typeList[0]"
      :on-exceed="handleExceed"
      :http-request="( selfUpload as any)"
    >
      <el-button link type="primary">上传并签章</el-button>
    </el-upload>
  </div>
</template>
<script lang="ts" setup>
import axios from "axios";
import { ElMessage } from "element-plus";
import { useUserStore } from "@/stores/user";
import type {
  UploadProps,
  UploadUserFile,
  UploadRequestOptions,
} from "element-plus";

const props = defineProps({
  url: {
    type: String,
    default: "",
  },
  typeList: {
    type: Array,
    default: () => [],
  },
  size: {
    type: Number,
    default: 4,
  },
  idywFile: {
    type: String,
    default: "",
  },
  materialName: {
    type: String,
    default: "",
  },
  ord: {
    type: String,
    default: "",
  },
  companyName: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["refresh"]);

const action = $computed(() => {
  if (props.url) {
    return props.url;
  } else {
    return `${import.meta.env.VITE_APP_BASE_URL}/v2/api/file/upload_attach_qyt`;
  }
});

const store = useUserStore();

let fileList = $ref<UploadUserFile[]>([]);

let loading = $ref(false);

const selfUpload = (options: UploadRequestOptions) => {
  let file = options.file;
  let filename = options.file.name;
  const params = new FormData();
  params.append("applyNo", store.applyId);
  params.append("fileName", filename);
  params.append("fileBody", file);
  params.append("idywFile", props.idywFile);
  params.append("materialName", props.materialName);
  params.append("ord", props.ord);
  params.append("companyName", props.companyName);
  loading = true;
  axios({
    url: action,
    method: "post",
    data: params,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }).then((res) => {
    fileList = [];
    loading = false;
    if (res.data.success === true) {
      axios({
        url: `${import.meta.env.VITE_APP_BASE_URL}/v2/api/file/ecert`,
        method: "post",
        data: params,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }).then((res) => {
        if (res.data.success === true) {
          emit("refresh");
          ElMessage({
            type: "success",
            message: "签章成功！",
          });
        } else {
          ElMessage({
            type: "error",
            message: "签章失败，请重新上传！",
          });
        }
      });
    } else {
      ElMessage({
        type: "error",
        message: "上传失败，请重新上传！",
      });
    }
  });
};

const beforeUpload: UploadProps["beforeUpload"] = (file) => {
  if (props.typeList.length !== 0) {
    const extension = file.name.split(".")[1].toLowerCase();
    if (props.typeList.indexOf(extension) == -1) {
      ElMessage({
        type: "error",
        message: "文件格式错误",
      });
      return false;
    }
  }
  const isLt40M = file.size / 1024 / 1024 < props.size;
  if (!isLt40M) {
    ElMessage({
      type: "error",
      message: `文件大小不能超过 ${props.size}MB!`,
    });
  }
  return isLt40M;
};

const handleExceed: UploadProps["onExceed"] = (files, uploadFiles) => {
  ElMessage.warning(`最多上传一个文件`);
};
</script>
