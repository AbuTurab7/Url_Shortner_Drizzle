import { Router } from "express";
import { getRegister ,postRegister, getLogin, postlogin } from "../Controllers/auth.controller.js";

const authRouter = Router();

authRouter.route("/register").get(getRegister).post(postRegister);

authRouter.route("/login").get(getLogin).post(postlogin);



export default authRouter;