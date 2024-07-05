import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import {
  addArticle,
  checkSlugArticle,
  deleteArticle,
  getSerchArticle,
  updateArticle,
} from "../controllers/article.controller.js";

const router = Router();

router.route("/add").post(verifyJwt, addArticle);
router.route("/search").get(verifyJwt, getSerchArticle);
router.route("/checkSlug").get(verifyJwt, checkSlugArticle);
router.route("/update").patch(verifyJwt, updateArticle);
router.route("/delete/:id").delete(verifyJwt, deleteArticle);

export default router;
