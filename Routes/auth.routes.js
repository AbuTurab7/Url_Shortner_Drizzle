import { Router } from "express";
import { getRegister ,postRegister, getLogin, postlogin , getProfile , getLogout } from "../Controllers/auth.controller.js";

const authRouter = Router();

authRouter.route("/register").get(getRegister).post(postRegister);

authRouter.route("/login").get(getLogin).post(postlogin);

authRouter.route("/profile").get(getProfile);

authRouter.route("/logout").get(getLogout);
export default authRouter;