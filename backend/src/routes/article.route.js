import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import {
  addArticle,
  checkSlugArticle,
  getAllArticle,
} from "../controllers/article.controller.js";

const router = Router();

router.route("/add").post(verifyJwt, addArticle);
router.route("/").get(verifyJwt, getAllArticle);
router.route("/checkSlug").get(verifyJwt, checkSlugArticle);

export default router;
