import { java, javaLanguage } from '@codemirror/lang-java';
import { setMyCompletions } from '../utils';
import { isArray } from 'lodash';

const getOptions = (options: myCompletionsExtension.item[] | undefined) => {
  const optionsList: any[] = [java()];
  if (options && isArray(options)) {
    optionsList.push(
      javaLanguage.data.of({ autocomplete: setMyCompletions(options) }),
    )
  }
  return optionsList;
};

export default {
  getOptions
};