import express from "express";
import { join } from "path";
import router from "./Routes/shortner.routes.js";
import {env} from "./config/env.js"
import authRouter from "./Routes/auth.routes.js";
import cookieParser from "cookie-parser";

const app = express();
app.set("view engine" , "ejs");
const staticPath = join(import.meta.dirname, "public");

app.use(express.static(staticPath));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(authRouter);
app.use(router);


const PORT = env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on PORT :${PORT}`);
});
