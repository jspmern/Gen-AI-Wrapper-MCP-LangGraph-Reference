"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesState = void 0;
const langgraph_1 = require("@langchain/langgraph");
exports.MessagesState = langgraph_1.Annotation.Root({
    ...langgraph_1.MessagesAnnotation.spec,
    pendingToolCall: (0, langgraph_1.Annotation)({
        value: (_old, newValue) => newValue,
        default: () => null,
    }),
    approvalDecision: (0, langgraph_1.Annotation)({
        value: (_old, newValue) => newValue,
        default: () => null,
    }),
});
