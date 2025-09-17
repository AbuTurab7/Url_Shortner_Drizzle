import express from "express";
import { join } from "path";
import router from "./Routes/shortner.routes.js";
import {env} from "./config/env.js"
import authRouter from "./Routes/auth.routes.js";
import cookieParser from "cookie-parser";
import { verifyAuthentication } from "./middlewares/verify-auth-middleware.js";
import flash from "connect-flash";
import session from "express-session";
import requestIp from "request-ip"
const app = express();
app.set("view engine" , "ejs");
const staticPath = join(import.meta.dirname, "public");

app.use(express.static(staticPath));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({secret : "my-secret-key" , resave : true ,  saveUninitialized : false}));
app.use(flash());
app.use(requestIp.mw());
app.use(verifyAuthentication);
app.use((req , res , next) => {
  res.locals.user = req.user;
  return next();
});
app.use(authRouter);
app.use(router);


const PORT = env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on PORT :${PORT}`);
});
