import { db } from "../config/db-client.js";
import { count, desc, eq } from "drizzle-orm";
import { shortLinksTable } from "../drizzle/schema.js";

export async function getLinks({ userId, limit, offset }) {
  const shortLinks = await db
    .select()
    .from(shortLinksTable)
    .where(eq(shortLinksTable.userId, userId))
    .orderBy(desc(shortLinksTable.createdAt))
    .limit(limit)
    .offset(offset);

  const [{ totalCounts }] = await db
    .select({totalCounts: count()})
    .from(shortLinksTable)
  .where(eq(shortLinksTable.userId, userId));

  return {shortLinks , totalCounts};
}

export async function saveToFile({ url, shortCode, userId }) {
  return await db.insert(shortLinksTable).values({ url, shortCode, userId });
}

export async function getShortLinks(shortCode) {
  return await db
    .select()
    .from(shortLinksTable)
    .where(eq(shortLinksTable.shortCode, shortCode));
}

export async function getShortLinkById(id) {
  return await db
    .select()
    .from(shortLinksTable)
    .where(eq(shortLinksTable.id, id));
}
export async function getShortLinkByUserId(id) {
  return await db
    .select()
    .from(shortLinksTable)
    .where(eq(shortLinksTable.userId, id));
}

export async function getUpdatedShortCode({ id, url, shortCode }) {
  return await db
    .update(shortLinksTable)
    .set({ url, shortCode })
    .where(eq(shortLinksTable.id, id));
}

export async function deleteShortLinkById(id) {
  return await db.delete(shortLinksTable).where(eq(shortLinksTable.id, id));
}
