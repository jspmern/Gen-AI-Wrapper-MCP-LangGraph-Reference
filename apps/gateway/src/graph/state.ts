import { Annotation, MessagesAnnotation } from "@langchain/langgraph";

export const MessagesState = Annotation.Root({
  ...MessagesAnnotation.spec,
  pendingToolCall: Annotation<any | null>({
    value: (_old, newValue) => newValue,
    default: () => null,
  }),
  approvalDecision: Annotation<any | null>({
    value: (_old, newValue) => newValue,
    default: () => null,
  }),
});