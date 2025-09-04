import { db } from "../config/db-client.js";
import { eq } from "drizzle-orm";
import { url_shortner } from "../drizzle/schema.js";

export async function getLinks(userId) {
  return  await db.select().from(url_shortner).where(eq(url_shortner.userId , userId));
}

export async function saveToFile({ url, shortCode , userId }) {
  return await db.insert(url_shortner).values({ url, shortCode , userId });
}

export async function getShortLinks(shortCode) {
  return await db.select().from(url_shortner).where(eq(url_shortner.shortCode , shortCode));
}
