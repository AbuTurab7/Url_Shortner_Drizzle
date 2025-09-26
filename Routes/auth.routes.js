import { Router } from "express";
import {
  getRegister,
  postRegister,
  getLogin,
  postlogin,
  getProfile,
  getLogout,
  getVerifyEmail,
  postResendVerificationLink,
  getVerifyEmailToken,
  getEditProfile,
  postEditProfile,
  getChangePassword,
  postChangePassword,
  getForgetPassword,
  postForgetPassword,
  getResetPassword,
  postResetPassword,
} from "../Controllers/auth.controller.js";

const authRouter = Router();

authRouter.route("/register").get(getRegister).post(postRegister);

authRouter.route("/login").get(getLogin).post(postlogin);

authRouter.route("/profile").get(getProfile);

authRouter.route("/verify-email").get(getVerifyEmail);

authRouter.route("/resend-verification-link").post(postResendVerificationLink);

authRouter.route("/verify-email-token").get(getVerifyEmailToken);

authRouter.route("/edit-profile").get(getEditProfile).post(postEditProfile);

authRouter.route("/change-password").get(getChangePassword).post(postChangePassword);

authRouter.route("/logout").get(getLogout);

authRouter.route("/forget-password").get(getForgetPassword).post(postForgetPassword);

authRouter.route("/reset-password/:token").get(getResetPassword).post(postResetPassword);

export default authRouter;
