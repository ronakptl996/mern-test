import { Router } from "express";
import {
  getUserDetails,
  loginHandler,
  logoutHandler,
  registerHandler,
} from "../controllers/user.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").get(verifyJwt, getUserDetails);
router.route("/logout").post(verifyJwt, logoutHandler);
router.route("/login").post(loginHandler);
router.route("/register").post(registerHandler);

export default router;
