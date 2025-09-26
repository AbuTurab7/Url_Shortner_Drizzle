import { db } from "../config/db-client.js";
import { and, eq, gte, lt, sql } from "drizzle-orm";
import {
  sessionsTable,
  usersTable,
  verifyEmailTokensTable,
} from "../drizzle/schema.js";
// import bcrypt from "bcrypt";
import crypto from "crypto";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import {
  ACCESS_TOKEN_EXPIRY,
  MILLISECONDS_PER_SECOND,
  REFRESH_TOKEN_EXPIRY,
} from "../config/constant.js";

export const getUserByEmail = async (email) => {
  return await db.select().from(usersTable).where(eq(usersTable.email, email));
};

export const createUser = async ({ name, email, password }) => {
  return await db
    .insert(usersTable)
    .values({ name, email, password })
    .$returningId();
};

export const getHashPassword = async (password) => {
  // return await bcrypt.hash(password , 10 );
  return await argon2.hash(password);
};

export const comparePassword = async (password, hashPassword) => {
  // return await bcrypt.compare(password , hashPassword);
  return await argon2.verify(hashPassword, password);
};

export const updateUserPassword = async (userId , password) => {
  return await db
    .update(usersTable)
    .set({ password })
    .where(eq(usersTable.id, userId));
};

export const getToken = ({ id, name, email }) => {
  return jwt.sign({ id, name, email }, process.env.JWT_KEY, {
    expiresIn: "30d",
  });
};

export const createSession = async (userId, { ip, userAgent }) => {
  const [session] = await db
    .insert(sessionsTable)
    .values({ userId, ip, userAgent })
    .$returningId();

  return session;
};

export const createAccessToken = ({ id, name, email, sessionId }) => {
  return jwt.sign({ id, name, email, sessionId }, process.env.JWT_KEY, {
    expiresIn: ACCESS_TOKEN_EXPIRY / MILLISECONDS_PER_SECOND,
  });
};
export const createRefreshToken = (sessionId) => {
  return jwt.sign({ sessionId }, process.env.JWT_KEY, {
    expiresIn: REFRESH_TOKEN_EXPIRY / MILLISECONDS_PER_SECOND,
  });
};

export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_KEY);
};

export const findSessionById = async (sessionId) => {
  const [session] = await db
    .select()
    .from(sessionsTable)
    .where(eq(sessionsTable.id, sessionId));

  return session;
};

export const findUserById = async (userId) => {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, userId));

  return user;
};

export const refreshTokens = async (refreshToken) => {
  try {
    const decodedToken = verifyToken(refreshToken);
    const currentSession = await findSessionById(decodedToken.sessionId);

    if (!currentSession || !currentSession.valid) {
      throw new Error("Invalid session");
    }
    const user = await findUserById(currentSession.userId);

    if (!user) throw new Error("Invalid user");

    const userInfo = {
      id: user.id,
      name: user.name,
      email: user.email,
      isEmailValid: user.isEmailValid,
      sessionId: currentSession.id,
    };

    const newAccessToken = createAccessToken(userInfo);

    const newRefreshToken = createRefreshToken(currentSession.id);

    return {
      newAccessToken,
      newRefreshToken,
      user: userInfo,
    };
  } catch (error) {
    console.log(error.message);
  }
};

export const deleteCurrentSession = async (sessionId) => {
  await db.delete(sessionsTable).where(eq(sessionsTable.id, sessionId));
};

export const generateRandomToken = (digit = 8) => {
  const min = 10 ** (digit - 1);
  const max = 10 ** digit;
  return crypto.randomInt(min, max).toString();
};

export const insertVerifyEmailToken = async ({ userId, token }) => {
  return db.transaction(async (tx) => {
    try {
      await tx
        .delete(verifyEmailTokensTable)
        .where(lt(verifyEmailTokensTable.expiresAt, sql`CURRENT_TIMESTAMP`));

      await tx
        .delete(verifyEmailTokensTable)
        .where(eq(verifyEmailTokensTable.userId, userId));

      await tx
        .insert(verifyEmailTokensTable)
        .values({ userId, token: token.toString() });
    } catch (error) {
      console.error("Failed to insert verification token", error);
      throw new Error("Unable to create verification token");
    }
  });
};

export const createVerifyLink = async ({ email, token }) => {
  const url = new URL(`${process.env.FRONTEND_URL}/verify-email-token`);
  url.searchParams.append("token", token);
  url.searchParams.append("email", email);
  return url.toString();
};

export const findVerificationEmailToken = async ({ token, email }) => {
  return db
    .select({
      userId: usersTable.id,
      email: usersTable.email,
      token: verifyEmailTokensTable.token,
      expiresAt: verifyEmailTokensTable.expiresAt,
    })
    .from(verifyEmailTokensTable)
    .where(
      and(eq(verifyEmailTokensTable.token, token)),
      eq(usersTable.email, email),
      gte(verifyEmailTokensTable.expiresAt, sql`CURRENT_TIMESTAMP`)
    )
    .innerJoin(usersTable, eq(usersTable.id, verifyEmailTokensTable.userId));
};

export const verifyUserEmailAndUpdateToken = async (email) => {
  await db
    .update(usersTable)
    .set({ isEmailValid: true })
    .where(eq(usersTable.email, email));
};

export const clearVerifyEmailToken = async (userId) => {
  return db
    .delete(verifyEmailTokensTable)
    .where(verifyEmailTokensTable.userId, userId);
};

export const updateProfile = async ({ userId, name }) => {
  return db.update(usersTable).set({ name }).where(eq(usersTable.id, userId));
};
