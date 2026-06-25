// apps/gateway/src/graph/mongoCheckpointer.ts

import { MongoClient } from "mongodb";
import { MongoDBSaver } from "@langchain/langgraph-checkpoint-mongodb";
import { config } from "@company/config";

let mongoClient: MongoClient | null = null;

export async function createMongoCheckpointer() {
  if (!config.MONGODB_URI) {
    throw new Error("MONGODB_URI is required");
  }

  if (!mongoClient) {
    mongoClient = new MongoClient(config.MONGODB_URI);
    await mongoClient.connect();
    console.log("MongoDB checkpointer connected");
  }

  const checkpointer = new MongoDBSaver({
    client: mongoClient as any,
    dbName: "ai_employee_mcp",
    checkpointCollectionName: "langgraph_checkpoints",
    // 'writesCollectionName' is not a valid property on MongoDBSaverParams
    // Remove it to satisfy the TypeScript type checks.
  });

  await checkpointer.setup();

  return checkpointer;
}