import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(process.cwd(), "../../.env")
});

 export  const config = {
  PORT: process.env.PORT,
  MONGODB_URI: process.env.MONGODB_URI
};
export * from "./index";