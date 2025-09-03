import { Router } from "express";
import { getRegister ,postRegister, getLogin, postlogin , getProfile } from "../Controllers/auth.controller.js";

const authRouter = Router();

authRouter.route("/register").get(getRegister).post(postRegister);

authRouter.route("/login").get(getLogin).post(postlogin);

authRouter.route("/profile").get(getProfile);

export default authRouter;