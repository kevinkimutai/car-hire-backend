import express from "express";
import { CHECKOUTSESSION, CREATEHIRE } from "../controller/hire-controller.js";
import {
  AUTHPROTECTED,
  RESTRICTEDROUTE,
} from "../controller/auth-controller.js";

const router = express.Router();

router
  .route("/")
  .get()
  .post(AUTHPROTECTED, RESTRICTEDROUTE("user"), CREATEHIRE, CHECKOUTSESSION);
router.route("/:hireId").patch().delete();

export default router;
