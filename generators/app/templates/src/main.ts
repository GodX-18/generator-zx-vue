import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
import ElementPlus from "element-plus";
import zhCn from "element-plus/lib/locale/lang/zh-cn";

import * as ElementPlusIconsVue from "@element-plus/icons-vue";


import App from "./App.vue";
import router from "./router";
// import "@/utils/permission";
import "element-plus/theme-chalk/src/index.scss";

import "normalize.css";
import "@/assets/styles/base.scss";
import "dayjs/locale/zh-cn";

const app = createApp(App);

app.config.globalProperties.$test = 'zx'

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.use(pinia);
app.use(router);
app.use(ElementPlus, {
  locale: zhCn,
});

app.mount("#app");
