// 引入本地图片
export function getImageUrl(url: string) {
  return new URL(url, import.meta.url).href;
}

export const isLoad = (url: string, noloadList: any[]) => {
  for (let i of noloadList) {
    if (url.startsWith(i)) {
      return false;
    }
  }
  return true;
};
