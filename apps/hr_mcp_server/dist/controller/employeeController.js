"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteByIdController = exports.createEmpController = exports.getByIdController = void 0;
const database_1 = require("@company/database");
const getByIdController = async (id) => {
    const result = await database_1.Employee.findById(id);
    return result;
};
exports.getByIdController = getByIdController;
const createEmpController = async ({ id, firstName, lastName, email, position, hireAt, salary, leave }) => {
    const user = new database_1.Employee({ id, firstName, lastName, email, position, hireAt, salary, leave });
    const newUser = await user.save();
    return newUser;
};
exports.createEmpController = createEmpController;
const deleteByIdController = async (id) => {
    const result = await database_1.Employee.findByIdAndDelete(id);
    return result;
};
exports.deleteByIdController = deleteByIdController;
