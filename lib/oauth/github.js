import { GitHub } from "arctic";
// import { env } from "../../config/env.js";

export const github = new GitHub(
  process.env.GITHUB_CLIENT_ID,
  process.env.GITHUB_CLIENT_SECRET,
  `${process.env.FRONTEND_URL}/github/callback`
);