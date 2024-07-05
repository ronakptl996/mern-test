import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import {
  addArticle,
  checkSlugArticle,
} from "../controllers/article.controller.js";

const router = Router();

router.route("/add").post(verifyJwt, addArticle);
router.route("/checkSlug").get(verifyJwt, checkSlugArticle);

export default router;
