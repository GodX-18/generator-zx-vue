import router from "@/router";

const whiteList = ["/404", "/home"]; // no redirect whitelist
router.beforeEach(async (to, from, next) => {
  if (whiteList.includes(to.path)) {
    // 在白名单中直接放行
    next();
  } else {
    next();
  }
});
