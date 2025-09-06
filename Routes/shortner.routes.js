import { Router } from "express";
import { shortener , getShortenURL , redirectURL , getShortCodeEdit , postShortCodeEdit } from "../Controllers/shortner.controller.js";

const router = Router();

router.post("/shorten" , shortener );

router.get("/", getShortenURL );

router.get("/:shortCode", redirectURL);

router.route("/edit/:id").get(getShortCodeEdit).post(postShortCodeEdit);

export default router;
