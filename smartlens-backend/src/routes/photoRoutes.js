const express = require("express");
const { protect, requireStudio } = require("../middleware/authMiddleware");
const { createPhoto, getMyPhotos, getPhotoStats, updatePhoto, deletePhoto } = require("../controllers/photoController");
const multer = require("multer");

const upload = multer({ dest: "uploads/" });
const router = express.Router();

router.post("/", protect, requireStudio, upload.single("image"), createPhoto);
router.get("/", protect, requireStudio, getMyPhotos);
router.get("/stats", protect, requireStudio, getPhotoStats);
router.put("/:id", protect, requireStudio, updatePhoto);
router.delete("/:id", protect, requireStudio, deletePhoto);

module.exports = router;
