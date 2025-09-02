import { db } from "../config/db-client.js";
import { eq , and } from "drizzle-orm";
import { users } from "../drizzle/schema.js";
import bcrypt from "bcrypt";
import argon2 from "argon2";

export const getUserByEmail = async (email) => {
    return await db.select().from(users).where(eq(users.email , email));
}

export const createUser = async ({ name , email , password}) => {
    return await db.insert(users)
    .values({ name , email , password})
    .$returningId();
}

export const getHashPassword = async (password) => {
    // return await bcrypt.hash(password , 10 );
    return await argon2.hash(password);
}

export const comparePassword = async (password , hashPassword) => {
    // return await bcrypt.compare(password , hashPassword);
    return await argon2.verify( hashPassword , password );
}