const express = require("express");
const { protect, requireStudio } = require("../middleware/authMiddleware");
const {
  createAlbum,
  getMyAlbums,
  updateAlbum,
  deleteAlbum,
  movePhotoToAlbum,
} = require("../controllers/albumController");

const router = express.Router();

router.post("/", protect, requireStudio, createAlbum);
router.get("/", protect, requireStudio, getMyAlbums);
router.put("/:id", protect, requireStudio, updateAlbum);
router.delete("/:id", protect, requireStudio, deleteAlbum);
router.put("/move-photo", protect, requireStudio, movePhotoToAlbum);

module.exports = router;
