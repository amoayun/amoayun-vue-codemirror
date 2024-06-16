import { json, jsonLanguage } from '@codemirror/lang-json';
import { setMyCompletions } from '../utils';

const getOptions = (options: myCompletionsExtension.item[] | undefined) => {
  const optionsList: any[] = [json()];
  if (options) {
    optionsList.push(
      jsonLanguage.data.of({ autocomplete: setMyCompletions(options) }),
    )
  }
  return optionsList;
};

export default {
  getOptions
};