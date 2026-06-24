import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(process.cwd(), "../../.env")
});

 export  const config = {
  PORT: process.env.PORT,
  MONGODB_URI: process.env.MONGODB_URI,
  HR_PORT:process.env.HR_PORT,
  OPENAI_API_KEY:process.env.OPENAI_API_KEY,
  LEAVE_PORT:process.env.LEAVE_PORT,
  USER_EMAIL:process.env.USER_EMAIL,
  JWT_SECRET:process.env.JWT_SECRET,
  JWT_EXPIRE_IN:process.env.JWT_EXPIRE_IN,
  JWT_TOKEN:process.env.JWT_TOKEN
};
export * from "./index";