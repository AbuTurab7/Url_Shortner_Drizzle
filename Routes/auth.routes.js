import { Router } from "express";
import multer from "multer";
import path from "path";
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
  getGoogleLogin,
  getGoogleLoginCallback,
  getGithubLogin,
  getGithubLoginCallback,
  getSetPassword,
  postSetPassword,
} from "../Controllers/auth.controller.js";

const authRouter = Router();

authRouter.route("/register").get(getRegister).post(postRegister);

authRouter.route("/login").get(getLogin).post(postlogin);

authRouter.route("/profile").get(getProfile);

authRouter.route("/verify-email").get(getVerifyEmail);

authRouter.route("/resend-verification-link").post(postResendVerificationLink);

authRouter.route("/verify-email-token").get(getVerifyEmailToken);

const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/avatar");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}_${Math.random()}${ext}`);
  },
});

const avatarFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const avatarUpload = multer({
  storage: avatarStorage,
  fileFilter: avatarFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5mb
});

authRouter.route("/edit-profile").get(getEditProfile).post( avatarUpload.single("avatar"), postEditProfile);

authRouter.route("/change-password").get(getChangePassword).post(postChangePassword);

authRouter.route("/forget-password").get(getForgetPassword).post(postForgetPassword);

authRouter.route("/reset-password/:token").get(getResetPassword).post(postResetPassword);

authRouter.route("/google").get(getGoogleLogin);

authRouter.route("/google/callback").get(getGoogleLoginCallback);

authRouter.route("/github").get(getGithubLogin);

authRouter.route("/github/callback").get(getGithubLoginCallback);

authRouter.route("/set-password").get(getSetPassword).post(postSetPassword);

authRouter.route("/logout").get(getLogout);

export default authRouter;
