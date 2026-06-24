"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("@company/database");
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const config_1 = require("@company/config");
const graph_1 = require("./graph/graph");
const auth_1 = require("@company/auth");
app.use(express_1.default.json());
/** this is the route place  */
app.get("/health", (req, res) => {
    res.send({ res: "okay ✅" });
});
app.get('/auth/login', async (req, res) => {
    const email = config_1.config.USER_EMAIL;
    const user = await database_1.Employee.findOne({ email });
    if (!user)
        return res.status(404).send({ msg: "User not found, please create user" });
    const payload = { email: user.email, role: user.position };
    const token = await (0, auth_1.generateJwtToken)(payload);
    res.send({ token });
});
/**this is the listing the app */
app.listen(config_1.config.PORT, async () => {
    await (0, database_1.connectDatabase)();
    console.log(`server is connect at http://localhost:${config_1.config.PORT}`);
    (0, graph_1.main)();
});
