"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesState = void 0;
const langgraph_1 = require("@langchain/langgraph");
exports.MessagesState = new langgraph_1.StateSchema({
    messages: langgraph_1.MessagesValue,
});
