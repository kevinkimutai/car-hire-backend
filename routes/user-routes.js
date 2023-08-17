import express from "express";

const router = express.Router();

router.route("/me").get();
router.route("/update-me").patch();
router.route("/delete-me").delete();

router.route("/").get();
router.route("/:id").get().patch().delete();

export default router;
