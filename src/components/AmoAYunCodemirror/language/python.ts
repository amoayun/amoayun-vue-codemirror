import { python, pythonLanguage } from '@codemirror/lang-python';
import { setMyCompletions } from '../utils';

const getOptions = (options: myCompletionsExtension.item[] | undefined) => {
  const optionsList: any[] = [python()];
  if (options) {
    optionsList.push(
      pythonLanguage.data.of({ autocomplete: setMyCompletions(options) }),
    )
  }
  return optionsList;
};

export default {
  getOptions
};