import { sql } from '@codemirror/lang-sql';

const getOptions = (options: myCompletionsExtension.item[] | undefined) => {
  const optionsList: any[] = [
    sql({
      upperCaseKeywords: false,
    })
  ];
  // if (options) {
  //   // 自定义 SQL 语法扩展
  //   const customSQLLanguage = StandardSQL.language.configure({
  //     props: [
  //       indentNodeProp.add({
  //         IfStatement: continuedIndent({ except: /^\s*elseUU\b/ }),
  //         Block: delimitedIndent({ closing: "}" })
  //       }),
  //       foldNodeProp.add({
  //         Block: foldInside
  //       })
  //     ]
  //   });
  //   optionsList.push(new LanguageSupport(customSQLLanguage));
  // }
  return optionsList;
};

export default {
  getOptions
};