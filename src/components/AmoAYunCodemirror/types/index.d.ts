declare namespace myCompletionsExtension {
  interface item {
    label: string;
    type?: "keyword" | "variable" | "text" | 'function';
    apply?: string;
    detail?: string;
  }
}

type langType = 'python' | 'java' | 'javascript' | 'sql' | 'json';