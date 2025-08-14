import { Prompt } from "@/lib/types";
import { useMemo } from "react";

export const usePromptVariable = (prompt: Prompt) => {
  // TODO 这里改为从 prompt.variables 中获取变量名
  const variableNames = useMemo(() => {
    // 匹配 {{变量名}}，变量名允许字母、数字、下划线，且不包含空格
    const regex = /{{\s*([a-zA-Z0-9_]+)\s*}}/g;
    const variables: Set<string> = new Set();
    let match: RegExpExecArray | null;

    while ((match = regex.exec(prompt.content)) !== null) {
      variables.add(match[1]); // match[1] 是变量名
    }

    // 返回去重后的变量名数组
    return Array.from(variables);
  }, [prompt.content]);

  return { variableNames };
};