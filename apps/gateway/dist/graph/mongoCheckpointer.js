"use strict";
// apps/gateway/src/graph/mongoCheckpointer.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMongoCheckpointer = createMongoCheckpointer;
const mongodb_1 = require("mongodb");
const langgraph_checkpoint_mongodb_1 = require("@langchain/langgraph-checkpoint-mongodb");
const config_1 = require("@company/config");
let mongoClient = null;
async function createMongoCheckpointer() {
    if (!config_1.config.MONGODB_URI) {
        throw new Error("MONGODB_URI is required");
    }
    if (!mongoClient) {
        mongoClient = new mongodb_1.MongoClient(config_1.config.MONGODB_URI);
        await mongoClient.connect();
        console.log("MongoDB checkpointer connected");
    }
    const checkpointer = new langgraph_checkpoint_mongodb_1.MongoDBSaver({
        client: mongoClient,
        dbName: "ai_employee_mcp",
        checkpointCollectionName: "langgraph_checkpoints",
        // 'writesCollectionName' is not a valid property on MongoDBSaverParams
        // Remove it to satisfy the TypeScript type checks.
    });
    await checkpointer.setup();
    return checkpointer;
}
