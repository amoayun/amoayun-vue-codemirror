<template>
  <div>
    <AmoAYunCodemirror v-model="jsonData" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const jsonData = ref<string>('');
</script>

<style scoped lang="less"></style>
