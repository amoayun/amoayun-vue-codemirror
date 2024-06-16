<template>
  <div>
    <AmoAYunCodemirror style="width: 500px;height: 320px;margin: 100px auto 0;" v-model="jsonData" lang="json"
      :options="myOptions" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const str = JSON.stringify({ "sweetheart": "阿芸", "desc": "you are the apple of my eyes" }, null, 2);
const jsonData = ref<string>(str);
// 自定义提示项
const myOptions: any = [
  { label: 'amoyun', type: 'keyword', apply: str },
]
</script>

<style scoped lang="less"></style>
