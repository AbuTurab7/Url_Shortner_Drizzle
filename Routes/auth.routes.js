import { Router } from "express";
import { registration , getLogin, loggedIn } from "../Controllers/auth.controller.js";

const authRouter = Router();

authRouter.get("/register" , registration );
// authRouter.route("/login").get(getLogin).post(loggedIn);
authRouter.route("/login").get(loggedIn);


export default authRouter;