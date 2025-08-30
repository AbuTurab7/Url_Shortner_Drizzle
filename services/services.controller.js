import { db } from "../config/db-client.js";
import { eq } from "drizzle-orm";
import { url_shortner } from "../drizzle/schema.js";

export async function getLinks() {
  return  await db.select().from(url_shortner);
}

export async function saveToFile({ url, shortCode }) {
  return await db.insert(url_shortner).values({ url, shortCode });
}

export async function getShortLinks(shortCode) {
  return await db.select().from(url_shortner).where(eq(url_shortner.shortCode , shortCode));
}
