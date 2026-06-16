import mongoose from "mongoose";
import {config} from "@company/config"
 
export async function connectDatabase() {
    const MONGODB_URI=config.MONGODB_URI || "mongodb://localhost:27017/ai_employee_mcp"
    try {
        const connection = await mongoose.connect(MONGODB_URI);
        console.log(`MongoDB Connected: ${MONGODB_URI}`);
    }
    catch (error) {
        console.error("MongoDB Connection Failed:", error);
        process.exit(1);
    }
}
