import { fileURLToPath } from "url";
import path from "path";

const getDirname = (): string => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  return __dirname;
};

export default getDirname;
