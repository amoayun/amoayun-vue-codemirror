import { CompletionContext } from "@codemirror/autocomplete"

export const setMyCompletions = (options: any[]) => {
  return (context: CompletionContext) => {
    let word: any = context.matchBefore(/\w*/) || {}
    if (word.from == word.to && !context.explicit) return null
    return {
      from: word.from,
      options
    }
  }
}

export default {
  setMyCompletions
}