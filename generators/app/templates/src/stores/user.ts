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
      businessCode: "",
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
    }
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
