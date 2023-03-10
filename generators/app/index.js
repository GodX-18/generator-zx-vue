const Generator = require("yeoman-generator");
const _ = require("lodash");
const path = require("path");
const fs = require("fs");
const chalk = require("chalk");
const utils = require("./utils");
const { spawn } = require("child_process");
_.extend(Generator.prototype, require("yeoman-generator/lib/actions/install"));

module.exports = class extends Generator {
  prompting() {
    return this.prompt([
      {
        type: "input",
        name: "name",
        message: "你的项目名称：",
        default: this.appname // appname 为项目生成目录名称
      },
      {
        type: "input",
        name: "description",
        message: "你的项目描述:",
        default: ""
      }
    ]).then((answers) => {
      this.answers = answers;
      this.log(chalk.green("name: ", answers.name));
      this.log(chalk.green("description: ", answers.description));
    });
  }
  writing() {
    // 把每一个文件都通过模板转换到目标路径
    const arr = utils.makePathArr(path.resolve(__dirname, "templates"));
    arr.forEach((item) => {
      this.fs.copyTpl(this.templatePath(item), this.destinationPath(item), this.answers);
    });
  }
  install() {
    this.installDependencies({
      yarn: { force: true },
      npm: false
    });
  }
  end() {
    this.log(chalk.green("恭喜🎉，安装完成!"));
  }
};
