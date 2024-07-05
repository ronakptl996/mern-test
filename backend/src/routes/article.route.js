import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import {
  addArticle,
  checkSlugArticle,
  deleteArticle,
  getAllArticle,
  updateArticle,
} from "../controllers/article.controller.js";

const router = Router();

router.route("/add").post(verifyJwt, addArticle);
router.route("/").get(verifyJwt, getAllArticle);
router.route("/checkSlug").get(verifyJwt, checkSlugArticle);
router.route("/update").patch(verifyJwt, updateArticle);
router.route("/delete/:id").delete(verifyJwt, deleteArticle);

export default router;
