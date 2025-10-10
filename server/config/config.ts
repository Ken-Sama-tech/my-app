import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(
    "C:\\Users\\Admin\\OneDrive\\Desktop\\projects\\my-app\\.env"
  ),
});

type Conn = () => Promise<void>;

const conn: Conn = async () => {
  try {
    if (mongoose.connection.readyState >= 1) return;

    await mongoose.connect(process.env.URI!);
    console.log("Connected to the database");
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

export default conn;
