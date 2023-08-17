import express from "express";

const router = express.Router();

router.route("/").get();
router.route("/:carId").post().delete();

export default router;
