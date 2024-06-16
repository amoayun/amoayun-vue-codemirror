import {
  javascript,
  javascriptLanguage,
  jsxLanguage,
  tsxLanguage,
  typescriptLanguage,
} from '@codemirror/lang-javascript';
import { setMyCompletions } from '../utils';

const getOptions = (options: myCompletionsExtension.item[] | undefined) => {
  const optionsList: any[] = [javascript({ jsx: true, typescript: true })];
  if (options) {
    optionsList.push(
      javascriptLanguage.data.of({ autocomplete: setMyCompletions(options) }),
      jsxLanguage.data.of({ autocomplete: setMyCompletions(options) }),
      tsxLanguage.data.of({ autocomplete: setMyCompletions(options) }),
      typescriptLanguage.data.of({ autocomplete: setMyCompletions(options) }),
    )
  }
  return optionsList;
}

export default {
  getOptions
};

