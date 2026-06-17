import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(process.cwd(), "../../.env")
});

 export  const config = {
  PORT: process.env.PORT,
  MONGODB_URI: process.env.MONGODB_URI,
  HR_PORT:process.env.HR_PORT
};
export * from "./index";