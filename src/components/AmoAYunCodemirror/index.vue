<template>
  <code-mirror v-model="jsonData" ref="codeMirrorRef" class="my-code-mirror my-scrollbar" wrap :extensions="extensions"
    v-bind="$attrs" @change="codeMirrorChange" />
</template>

<script setup lang="ts">
import CodeMirror from 'vue-codemirror6';
import { basicSetup } from 'codemirror';
import { oneDark } from '@codemirror/theme-one-dark';
import { computed, ref, nextTick, watchEffect, toRaw } from 'vue';
import { getExtension } from './language';
const props = defineProps<{
  lang?: langType; // 语言类型
  dark?: boolean; // 是否使用暗黑主题
  options?: Array<myCompletionsExtension.item>; // 自定义语法扩展
  modelValue: string; // 绑定值
}>();
const emits = defineEmits(['update:modelValue']);
const jsonData = ref<string>('');
const insertFlag = ref<boolean>(false);
const codeMirrorRef = ref<any>(null);
watchEffect(() => {
  if (typeof props.modelValue !== 'string') {
    // console.error('codeMirror组件 v-model 绑定值必须是字符串类型');
    return;
  };
  // 如果插入标识为false，说明是外层的数据发生了改变
  if (!insertFlag.value) {
    // 如果外层数据长度小于当前数据长度,重置光标位置，防止因为数据长度变化导致光标位置不正确而导致报错
    if (props.modelValue.length < jsonData.value.length) {
      codeMirrorRef.value.setCursor(props.modelValue.length);
    }
  }
  jsonData.value = props.modelValue;
});
const codeMirrorChange = () => emits('update:modelValue', jsonData.value);
// 语法扩展
const extensions = computed(() => {
  const exts = [
    basicSetup,
    ...getExtension(props.lang, props.options),
  ];
  // 是否使用暗黑主题
  if (props.dark) exts.push(oneDark);
  return exts;
});
// 指定光标位置插入文本
const insertText = (text: string) => {
  if (!codeMirrorRef.value || !text) return;
  insertFlag.value = true;
  // 当 insertFlag 渲染完成后再执行插入操作
  nextTick(() => {
    // 获取光标位置
    const cursor = codeMirrorRef.value.getCursor();
    // 插入文本
    jsonData.value = `${jsonData.value.slice(0, cursor)}${text}${jsonData.value.slice(cursor)}`;
    // 设置光标位置
    codeMirrorRef.value.focus = true;
    nextTick(() => {
      // 设置光标位置
      codeMirrorRef.value.setCursor(cursor + text.length);
      // 重置插入标识
      insertFlag.value = false;
    })
  })
};
defineExpose<{
  insertText: typeof insertText,
  codeMirror: any
}>({
  insertText,
  codeMirror: toRaw(codeMirrorRef)
});
</script>

<style scoped lang="less">
.my-code-mirror {
  width: 100%;
  border: 1px solid #eee;
  overflow: auto;
  position: relative;

  :deep(.cm-editor) {
    min-height: 100%;

    &.cm-focused {
      outline: none;
    }
  }
}

// 兼容windows系统下的滚动条样式
.my-scrollbar {
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #ccc;
    border-radius: 6px;
  }
}

.my-no-scrollbar {
  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
