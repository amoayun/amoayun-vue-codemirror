<template>
  <code-mirror
    v-model="jsonData"
    ref="codeMirrorRef"
    class="my-code-mirror my-scrollbar"
    :wrap="computedWrap"
    :extensions="computedExtensions"
    @change="codeMirrorChange"
    @ready="codeMirrorReady"
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
import CodeMirror from "vue-codemirror6";
import { basicSetup } from "codemirror";
import { oneDark } from "@codemirror/theme-one-dark";
import { computed, ref, watchEffect, toRaw } from "vue";
import { getExtension } from "./language";
const props = defineProps<{
  lang?: langType; // 语言类型
  dark?: boolean; // 是否使用暗黑主题
  options?: Array<myCompletionsExtension.item>; // 自定义语法扩展
  modelValue?: string; // 绑定值
  wrap?: boolean; // 是否自动换行
  extensions?: any[]; // 语法扩展
}>();
const computedWrap = computed(() =>
  props.wrap !== undefined ? props.wrap : false
);
const emits = defineEmits(["update:modelValue", "ready", "change"]);
const jsonData = ref<string>("");
const codeMirrorRef = ref<any>(null);
const codeMirrorIsReady = ref<boolean>(false);

watchEffect(() => {
  // 如果codemirror没有准备好，直接返回
  if (!codeMirrorIsReady.value) return;
  // 如果不是字符串，直接返回
  if (typeof props.modelValue !== "string") return;
  // 如果相同，直接返回
  if (props.modelValue === jsonData.value) return;
  codeMirrorRef.value.replaceRange(props.modelValue, 0, jsonData.value.length);
});
const codeMirrorReady = () => {
  codeMirrorIsReady.value = true;
  emits("ready");
};
const codeMirrorChange = (e: any) => {
  emits("update:modelValue", e.toJSON().doc);
  emits("change", e);
};
// 语法扩展
const computedExtensions = computed(() => {
  const exts = [basicSetup, ...getExtension(props.lang, props.options)];
  // 是否使用暗黑主题
  if (props.dark) exts.push(oneDark);
  return exts;
});
// 指定光标位置插入文本
const insertText = (text: string) => {
  if (!codeMirrorRef.value || !text || typeof text !== "string") return;
  // 获取光标位置
  const cursor = codeMirrorRef.value.getCursor() || 0;
  // 插入文本
  codeMirrorRef.value.replaceRange(text, cursor, cursor);
  // 设置光标位置
  codeMirrorRef.value.focus = true;
  // 设置光标位置
  codeMirrorRef.value.setCursor(cursor + text.length);
};
defineExpose<{
  insertText: typeof insertText;
  codeMirror: any;
}>({
  insertText,
  codeMirror: toRaw(codeMirrorRef),
});
</script>

<style scoped lang="less">
.my-code-mirror {
  width: 100%;
  border: 1px solid var(--color-neutral-3);
  overflow: auto;
  min-height: 200px;
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
    background-color: var(--color-neutral-4);
    border-radius: 6px;
  }
}

.my-no-scrollbar {
  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
