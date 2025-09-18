//utilities
import path from "path";
import getDirname from "./utils/getDirname.js";
import * as dotenv from "dotenv";
//dependencies
import express from "express";
import cors from "cors";
//routers
import playerRouter from "./routes/proxy.route.js";
import extensionsRouter from "./routes/extensions.route.js";

import { loadEntry } from "../extensions/anime/allanime/loadAnime.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = getDirname();

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "./public")));

//routers
app.use("/proxy", playerRouter);
app.use("/extensions", extensionsRouter);

app.listen(PORT, () => console.log(`listening at port ${PORT}`));
