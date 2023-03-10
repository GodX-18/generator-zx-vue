const fs = require("fs");

let res = [];

function makePathArr(dir) {
  let arr = fs.readdirSync(dir);

  for (let i of arr) {
    let obj = fs.statSync(`${dir}/${i}`);

    if (obj.isDirectory()) {
      makePathArr(`${dir}/${i}`);
    } else {
      res.push(`${dir}/${i}`);
    }
  }
  const resArr = res.map((item) => {
    const arr = item.split("templates/");
    return arr[1];
  });
  return resArr;
}

module.exports = { makePathArr };
