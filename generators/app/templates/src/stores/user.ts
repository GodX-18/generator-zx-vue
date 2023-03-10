import { defineStore } from "pinia";
import type { loginParams } from "@/api/models/homeModel";
import type { enterpriseInfoModel } from "./models/userModel";
import { useRoute } from "vue-router";

export const useUserStore = defineStore("user", {
  state: () => {
    return {
      userParams: {
        ticket: "",
        declarebm: "",
        declareid: "",
      },
      businessName: "",
      businessCode: "",
      enterpriseInfo: {} as enterpriseInfoModel,
      applyId: "",
      submitForm: {} as any,
      action: "view",
      isLive: true, // 是否现场施工户
      oldApplyId: "", // 老件ID
    };
  },
  getters: {
    // 是否为老件
    isOld: (state) => {
      if (state.oldApplyId) {
        return false;
      } else {
        return true;
      }
    },
    ywType: (state) => {
      switch (state.businessCode) {
        case "3205900000000010016200001":
          return "add"; // 核发
        case "3205900000000010016200002":
          return "change"; // 变更
        case "3205900000000010016200003":
          return "delay"; // 延期
        default:
          return "none";
      }
    },
    //* 变更：基本情况可以编辑，其它不行
    //* 延期：都不可以编辑
    //* 核发：都可以编辑
    //* 查看：都不可以编辑
    isDisabled(): boolean {
      const route = useRoute();
      if (this.action === "view") {
        return true;
      } else if (
        this.ywType === "change" &&
        route.name !== "step1" &&
        !this.isOld
      ) {
        return true;
      } else if (this.ywType === "delay" && !this.isOld) {
        return true;
      } else {
        return false;
      }
    },
  },
  persist: {
    storage: sessionStorage,
    // 指定需要持久化的数据
    // paths: ["userParams.ticket",  "businessCode"],
  },
  actions: {
    setUserParams(params: loginParams) {
      this.userParams = { ...this.userParams, ...params };
    },
  },
});
