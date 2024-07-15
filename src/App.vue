<template>
  <div style="width: 500px; height: 80vh; margin: 100px auto 0">
    <AmoAYunCodemirror v-model="jsonData" lang="json" :options="myOptions" />
    <div>
      <button @click="jsonData = ''">清空数据</button>
      <button @click="jsonData = str2" style="margin-left: 10px">
        重置数据
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
const str = JSON.stringify(
  { sweetheart: "阿芸", desc: "you are the apple of my eyes" },
  null,
  2
);
const str2 = JSON.stringify(
  { sweetheart: "阿芸", desc: "I love you" },
  null,
  2
);
const jsonData = ref<string>(str);
// 自定义提示项
const myOptions: any = [
  {
    label: "amoyun",
    type: "keyword",
    apply: JSON.stringify(
      { sweetheart: "阿芸", desc: "you are the apple of my eyes" },
      null,
      2
    ),
  },
];
</script>

<style scoped lang="less"></style>
