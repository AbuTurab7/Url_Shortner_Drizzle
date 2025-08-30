import { Router } from "express";
import { shortener , getShortenURL , redirectURL } from "../Controllers/shortner.controller.js";

const router = Router();

router.post("/shorten" , shortener );

router.get("/", getShortenURL );

router.get("/:shortCode", redirectURL);

export default router;
