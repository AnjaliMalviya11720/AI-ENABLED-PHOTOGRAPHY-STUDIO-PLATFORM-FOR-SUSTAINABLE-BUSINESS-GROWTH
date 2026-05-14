const Album = require("../models/Album");
const Photo = require("../models/Photo");

exports.createAlbum = async (req, res) => {
  try {
    const { name, description } = req.body;
    const album = await Album.create({
      name,
      description,
      studio: req.studio._id,
    });
    return res.status(201).json({ success: true, data: album });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMyAlbums = async (req, res) => {
  try {
    const albums = await Album.find({ studio: req.studio._id }).sort({
      createdAt: -1,
    });
    return res.status(200).json({ success: true, data: albums });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateAlbum = async (req, res) => {
  try {
    const { name, description } = req.body;
    const album = await Album.findOneAndUpdate(
      { _id: req.params.id, studio: req.studio._id },
      { name, description },
      { new: true }
    );
    if (!album) {
      return res.status(404).json({ success: false, message: "Album not found" });
    }
    return res.status(200).json({ success: true, data: album });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteAlbum = async (req, res) => {
  try {
    const album = await Album.findOneAndDelete({
      _id: req.params.id,
      studio: req.studio._id,
    });
    if (!album) {
      return res.status(404).json({ success: false, message: "Album not found" });
    }
    await Photo.updateMany(
      { studio: req.studio._id, album: req.params.id },
      { $set: { album: null } }
    );
    return res
      .status(200)
      .json({ success: true, message: "Album deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.movePhotoToAlbum = async (req, res) => {
  try {
    const { photoId, albumId } = req.body;

    const photo = await Photo.findOne({ _id: photoId, studio: req.studio._id });
    if (!photo) {
      return res.status(404).json({ success: false, message: "Photo not found" });
    }

    if (albumId) {
      const album = await Album.findOne({ _id: albumId, studio: req.studio._id });
      if (!album) {
        return res.status(404).json({ success: false, message: "Album not found" });
      }
    }

    photo.album = albumId || null;
    await photo.save();

    return res.status(200).json({ success: true, data: photo });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
