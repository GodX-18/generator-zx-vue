import router from "@/router";

const whiteList = ["/404", "/home"]; // no redirect whitelist

router.beforeEach((to, from, next) => {
  if (whiteList.includes(to.path)) {
    // 在白名单中直接放行
    next();
  } else {
    if (to.matched.length === 0) {
      next("/404"); // 判断此跳转路由的来源路由是否存在，存在的情况跳转到来源路由，否则跳转到404页面
    }
    next();
  }
});
