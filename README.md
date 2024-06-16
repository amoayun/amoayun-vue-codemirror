# 简单的介绍

> - 为什么作用域 ***@amoayun***  
> - 因为最初想要的名字是 ***@ayun*** ，但是已经被注册了
> - 为什么最初想要的名字是 ***@ayun*** ？
> - 因为我爱上了一个人，大概是2015年到2016年的时候爱上的，很爱很爱她。我叫她 ***阿芸***，所以 ***@ayun*** 是 ***阿芸*** 的谐音
> - ***在一起了没？***（满足你八卦的心）
> - 没有，但是相信我们的故事正在发生。可能知道结果不尽人意，但是只要见到她就很开心呀，哈哈哈
> - 作为开发者的你 ***现在有喜欢的人吗？***  
>> - ### 愿我家 ***阿芸*** 平安喜乐，万事胜意。
>> - 愿天下有情人终成眷属
>> - 愿世界和平
>> - 愿本组件能完美的帮助你呀
  
  <br/>

# 安装

```shell
npm install @amoayun/vue-codemirror --save
```

<br/>

# 基础使用方法

```javascript
// **.vue文件中

<template>
  <AmoAYunCodemirror v-model="jsonData" lang='json' :options="myOptions"/>
</template>

<script setup>
  import { ref } from 'vue';
  import { AmoAYunCodemirror } from '@amoayun/vue-codemirror';
  import '@amoayun/vue-codemirror/dist/style.css';

  const jsonData = ref<string>(JSON.stringify({ "sweetheart": "阿芸", "desc": "you are the apple of my eyes" }, null, 2));

  {/*  自定义提示 */}
  const myOptions: any = [
    { label: 'amoyun', type: 'keyword' },
  ]
</script>
```

![图片](./dist/picture_1.jpg)

<br/>

<style>
  .wide-table {
    width: 100%;
  }
  .wide-table .column-1{
    width: 60px;
  }
  .wide-table .column-2{
    width: 110px;
  }
  .wide-table .column-4{
    width: 70px;
    text-align: center;
  }
</style>
<table class="wide-table">
  <tr>
    <th class="column-1">属性名</th>
    <th class="column-2">描述</th>
    <th class="column-3">类型</th>
    <th class="column-4">默认值</th>
  </tr>
  <tr>
    <td class="column-1">v-mode</td>
    <td class="column-2">绑定</td>
    <td class="column-3">strin</td>
    <td class="column-4">-</td>
  </tr>
  <tr>
    <td class="column-1">options</td>
    <td class="column-2">自定义提示项</td>
    <td class="column-3">Array<{label: string;type?: "keyword"|"variable"|"text"|'function';apply?: string;detail?: string; }></td>
    <td class="column-4">-</td>
  </tr>
  <tr>
    <td class="column-1">dark</td>
    <td class="column-2">是否开启暗黑模式</td>
    <td class="column-3">boolean</td>
    <td class="column-4">-</td>
  </tr>
  <tr>
    <td class="column-1">disabled</td>
    <td class="column-2">是否禁用</td>
    <td class="column-3">boolean</td>
    <td class="column-4">-</td>
  </tr>
  <tr>
    <td class="column-1">lang</td>
    <td class="column-2">支持的语法</td>
    <td class="column-3">'python'|'java'|'javascript'|'sql'|'json' 目前只适配了这几种语言</td>
    <td class="column-4">-</td>
  </tr>
</table>


> ### 【注意】
> - 当 __lang__ 为 __sql__ 时，配置的 __options__ 会失效（因为我太菜，还没有想到办法适配）
> - 其他的属性你们就可以直接参考 ___[vue-codemirror6](https://github.com/logue/vue-codemirror6)___ 了，我就是个二道贩子，哈哈哈，基于 ___[vue-codemirror6](https://github.com/logue/vue-codemirror6)___  做的一层封装，让大家感觉更方便用一点

<br/>

# 方法

| 方法名     | 描述                      | 参数        | 返回值 |
| ---------- | ------------------------- | ----------- | ------ |
| insertText | 光标位置插入内容          | val: string | -      |
| codeMirror | 组件内部的codeMirror的ref | -           | -      |

<br/>

# 后续
- 我当然会一致坚持啦，哈哈哈，因为看见她我就很开心呀，哈哈哈
- 组件会持续完善的，感谢大家的使用