import { db } from "../config/db-client.js";
import { eq , and } from "drizzle-orm";
import { users } from "../drizzle/schema.js";

export const getUserByEmail = async (email) => {
    return await db.select().from(users).where(eq(users.email , email));
}

export const createUser = async ({ name , email , password}) => {
    return await db.insert(users)
    .values({ name , email , password})
    .$returningId();
}
