"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@company/config");
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const PORT = config_1.config.LEAVE_PORT || 4202;
app.get("/", (req, res) => {
    res.send({ message: `leave_mcp_server is up at ${PORT}` });
});
app.listen(PORT, () => {
    console.log(`leave_mcp_server is connect at http://localhost:${config_1.config.LEAVE_PORT}`);
});
