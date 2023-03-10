import axios from "axios";
// 引入本地图片
export function getImageUrl(url: string) {
  return new URL(url, import.meta.url).href;
}
