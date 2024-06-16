<template>
  <div>
    <AmoAYunCodemirror style="width: 500px;height: 320px;margin: 100px auto 0;" v-model="jsonData" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const jsonData = ref<string>('');
</script>

<style scoped lang="less"></style>
