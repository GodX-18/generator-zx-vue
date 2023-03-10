import request from "@/utils/request";
import type { uploadParams, signParams } from "./models/stepsModel";

// 暂存
export function next(params: any) {
  return request.post("/front/baseinfo/drainDetail_qyt", params);
}

// 填写详情
export function fetchDatailById(applyId: string) {
  return request.post("/front/baseinfo/eDetail_qyt", {
    applyId,
  });
}

// 获取上传图片
export function fetchImages(applyNo: string) {
  return request.post("/api/drain/drainDetailImage_qyt", {
    applyNo,
  });
}

// 排水网管情况
export function fetchOnlineManage(applyId: string) {
  return request.post("/api/drainLine/eDetail_qyt", {
    applyId,
  });
}

// 保存排水网管情况
export function saveOnlineManage(params: any) {
  return request.post("/api/drainLine/save_qyt", params, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

// 保存水质信息
export function saveWaterQuailty(params: any[]) {
  return request.post("/api/quality/change_qyt", params);
}

// 水质详情
export function fetchWaterQuailty(applyId: string) {
  return request.post("/api/quality/eDetail_qyt", {
    applyId,
  });
}

// 需要上传的材料
export function fetchAttachments(params: any) {
  return request.post("/api/attachment/attachmentList_qyt", params);
}

// 提交
export function submitdrain(params: any) {
  return request.post("/api/submitdrain/submitdrain_qyt", params);
}

// 自动生成上传签章
export function makeAndUploadSign(applyId: string, type: string) {
  return request.get(`/v2/pdf/makeQz?applyId=${applyId}&type=${type}`);
}

// 上传
export function uploadMaterial(params: uploadParams) {
  return request.post("/v2/api/file/upload_attach_qyt", params, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

// 签章
export function sign(params: signParams) {
  return request.post("/v2/api/file/ecert", params);
}

// 预览
export function priew(data: any) {
  return request.get("/v2/api/file/previewFile_qyt2", { data });
}
