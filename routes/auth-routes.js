import express from "express";

import { LOGIN, SIGNUP } from "../controller/auth-controller.js";

const router = express.Router();

router.route("/signup").post(SIGNUP);
router.route("/login").post(LOGIN);

export default router;
