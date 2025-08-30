import { Router } from "express";
import { getRegister ,postRegister, getLogin, postlogin } from "../Controllers/auth.controller.js";

const authRouter = Router();

authRouter.route("/register").get(getRegister).post(postRegister);
// authRouter.get("/register" , registration );
authRouter.route("/login").get(getLogin).post(postlogin);
// authRouter.route("/login").get(loggedIn);


export default authRouter;