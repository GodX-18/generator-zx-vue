import request from "@/utils/request";

// 获取办件列表
export function fetchAppealList(params: any) {
  return request.post("/api/drain/drainApplyList_qyt", params);
}

// 删除办件
export function delAppeal(applyId: string) {
  return request.post("/api/submitdrain/delDrag_qyt", { applyId });
}

// 撤回办件
export function withdrawAppeal(applyId: string) {
  return request.post("/api/submitdrain/reverKDrag_qyt", { applyId });
}
