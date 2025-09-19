import { ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY } from "../config/constant.js";
import { createAccessToken, createRefreshToken, createSession, refreshTokens, verifyToken } from "../services/auth.services.controller.js";

export const verifyAuthentication = async (req, res, next) => {
  const accessToken = req.cookies.access_token;
  const refreshToken = req.cookies.refresh_token;

  req.user = null;

  if (!accessToken && !refreshToken) {
    return next();
  }

  if (accessToken) {
    const decodedToken = verifyToken(accessToken);
    req.user = decodedToken;
    return next();
  }

  if (refreshToken) {
    try {
      const { newAccessToken, newRefreshToken, user } = await refreshTokens(
        refreshToken
      );
      req.user = user;

      const baseConfig = { httpOnly: true, secure: true };

      res.cookie("access_token", newAccessToken, {
        ...baseConfig,
        maxAge: ACCESS_TOKEN_EXPIRY,
      });

      res.cookie("refresh_token", newRefreshToken, {
        ...baseConfig,
        maxAge: REFRESH_TOKEN_EXPIRY,
      });

      return next();
    } catch (error) {
      console.log(error.message);
    }
  }
  return next();
};

export const authenticateUser = async ({ req , res , user , name , email }) => {
    const session = await createSession(user.id , {
    ip: req.clientIp,
    userAgent: req.headers["user-agent"],
  });

  const accessToken = createAccessToken({
    id : user.id,
     name : name,
    email : email,
    isEmailValid: false,
    sessionId : session.id,
  });

  const refreshToken = createRefreshToken( session.id );

  const baseConfig = { httpOnly: true , secure: true };

  res.cookie("access_token", accessToken , {
    ...baseConfig,
    maxAge: ACCESS_TOKEN_EXPIRY,
  });

  res.cookie("refresh_token", refreshToken , {
    ...baseConfig,
    maxAge: REFRESH_TOKEN_EXPIRY,
  });

  res.redirect("/");
}