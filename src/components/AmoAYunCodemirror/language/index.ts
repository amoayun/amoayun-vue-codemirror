import { autocompletion, completeFromList } from '@codemirror/autocomplete';
import java from './java';
import json from './json';
import python from './python';
import sql from './sql';
import javascript from './javascript';

export const getExtension = (lang: langType | undefined, options: myCompletionsExtension.item[] | undefined) => {
  const extensions: any[] = [];
  switch (lang) {
    case 'java':
      extensions.push(java.getOptions(options));
      break;
    case 'json':
      extensions.push(json.getOptions(options));
      break;
    case 'python':
      extensions.push(python.getOptions(options));
      break;
    case 'sql':
      extensions.push(sql.getOptions(options));
      break;
    case 'javascript':
      extensions.push(javascript.getOptions(options));
      break;
    default:
      extensions.push(autocompletion({ override: [completeFromList(options || [])] }));
      break;
  }
  return extensions;
}

export default {
  getExtension
};