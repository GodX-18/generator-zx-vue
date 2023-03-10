const Generator = require("yeoman-generator");
const path = require("path");
const utils = require("./utils");

module.exports = class extends Generator {
  prompting() {
    return this.prompt([
      {
        type: "input",
        name: "name",
        message: "Your project name",
        default: this.appname // appname 为项目生成目录名称
      }
    ]).then((answers) => {
      this.answers = answers;
    });
  }
  writing() {
    // 把每一个文件都通过模板转换到目标路径
    const arr = utils.makePathArr(path.resolve(__dirname, "templates"));
    arr.forEach((item) => {
      this.fs.copyTpl(this.templatePath(item), this.destinationPath(item), this.answers);
    });
  }
};
