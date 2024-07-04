import { Router } from "express";
import {
  loginHandler,
  registerHandler,
} from "../controllers/user.controller.js";

const router = Router();

router.route("/login").post(loginHandler);
router.route("/register").post(registerHandler);

export default router;
