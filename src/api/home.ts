import request from "@/utils/request";
import type { businessInfoParams, dialogSaveParams } from "./models/homeModel";

// 获取首页相关数据
export function fetchHomeData(params: businessInfoParams) {
  return request.post("/api/applyInfo/sbsm/cjsm/info", params);
}

// 获取企业相关信息
export function fetchEnterpriseInfo() {
  return request.post("/publication/mainData");
}

// 首次弹框确定操作
export function dialogSave(params: dialogSaveParams[]) {
  return request.post("/api/applyInfo/sbsm/cjsm/save", params);
}
