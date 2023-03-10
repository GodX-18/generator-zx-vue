import axios from "axios";
// 引入本地图片
export function getImageUrl(url: string) {
  return new URL(url, import.meta.url).href;
}

//  获取token
async function queryToken() {
  const { data } = await axios({
    method: "post",
    url: "http://58.210.9.131:5180/SIPGIS/auth/jwt/token",
    data: {
      username: "wgpt",
      password: "wgpt@",
      appId: "BASE-ADMIN",
    },
  });
  if (data.code === 200) {
    return data.token;
  }
}

// 获取所属区域
export async function getArea(address: string) {
  const token = await queryToken();
  const { data } = await axios({
    method: "get",
    url: "http://58.210.9.131/cic/SIPGIS/xzspj/copaddcheck",
    params: {
      sipsdToken: token,
      address,
      corpname: 1,
      s: new Date().getTime(),
    },
  });
  if (data.statuscode === 1) {
    return data.result[0].funczone;
  }
}
