<!-- 无渲染组件 -->
<script>
export default {
  data() {
    return {
      timer: "", //定义一个定时器的变量
      currentTime: "", // 获取当前时间
    };
  },
  created() {
    var weekday = [
      "星期日",
      "星期一",
      "星期二",
      "星期三",
      "星期四",
      "星期五",
      "星期六",
    ];
    var d = new Date();
    this.timer = setInterval(() => {
      var year = new Date().getFullYear();
      var month = this.appendZero(new Date().getMonth() + 1);
      var day = this.appendZero(new Date().getDate());
      var hour = this.appendZero(new Date().getHours());
      var minute = this.appendZero(new Date().getMinutes());
      var second = this.appendZero(new Date().getSeconds());
      //修改数据date
      this.currentTime =
        year +
        "-" +
        month +
        "-" +
        day +
        " " +
        weekday[d.getDay()] +
        " " +
        hour +
        ":" +
        minute +
        ":" +
        second;
    }, 1000);
  },
  methods: {
    //时间过滤加0
    appendZero(obj) {
      if (obj < 10) {
        return "0" + obj;
      } else {
        return obj;
      }
    },
  },
  beforeUnmount() {
    if (this.timer) {
      clearInterval(this.timer); // 在Vue实例销毁前，清除我们的定时器
    }
  },
};
</script>

<template>
  <slot :time="currentTime" />
</template>
