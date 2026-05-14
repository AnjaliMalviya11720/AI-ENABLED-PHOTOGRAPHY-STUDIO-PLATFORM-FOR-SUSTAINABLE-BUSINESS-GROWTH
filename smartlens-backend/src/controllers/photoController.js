const Photo = require("../models/Photo");


exports.createPhoto = async (req, res) => {
  try {
    const { title, category } = req.body;
    let imageUrl = req.body.imageUrl || "";

    if (req.file) {
      imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    }

    if (!imageUrl) {
      return res.status(400).json({ success: false, message: "Please upload an image" });
    }

    const studio = req.studio;

    
    if (studio.subscriptionPlan === "free") {
      const photoCount = await Photo.countDocuments({ studio: studio._id });

      if (photoCount >= 5) {
        return res.status(403).json({
          success: false,
          message: "Free plan limit reached. Upgrade to premium to upload more photos."
        });
      }
    }

    const photo = await Photo.create({
      title,
      imageUrl,
      category,
      studio: studio._id
    });

    res.status(201).json({
      success: true,
      data: photo
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


exports.getMyPhotos = async (req, res) => {
  try {
    const photos = await Photo.find({ studio: req.studio._id });

    res.status(200).json({
      success: true,
      count: photos.length,
      data: photos
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


exports.getPhotoStats = async (req, res) => {
  try {
    const studioId = req.studio._id;

    const totalPhotos = await Photo.countDocuments({ studio: studioId });

    const categoryStats = await Photo.aggregate([
      { $match: { studio: studioId } },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 }
        }
      }
    ]);

    const latestPhotos = await Photo.find({ studio: studioId })
      .sort({ createdAt: -1 })
      .limit(5);

    
    let insights = null;

    if (categoryStats.length > 0) {
      const mostPopular = categoryStats.reduce((prev, current) =>
        current.count > prev.count ? current : prev
      );

      const percentage = ((mostPopular.count / totalPhotos) * 100).toFixed(2);

      insights = {
        mostPopularCategory: mostPopular._id,
        percentage: `${percentage}%`,
        message: `${mostPopular._id} is your most uploaded category`
      };
    }

    res.status(200).json({
      success: true,
      data: {
        totalPhotos,
        categoryStats,
        latestPhotos,
        insights
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};




exports.updatePhoto = async (req, res) => {
  try {
    const { title, category } = req.body;
    const photo = await Photo.findOne({ _id: req.params.id, studio: req.studio._id });

    if (!photo) {
      return res.status(404).json({ success: false, message: "Photo not found or unauthorized" });
    }

    photo.title = title || photo.title;
    photo.category = category || photo.category;
    await photo.save();

    res.status(200).json({ success: true, data: photo });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.deletePhoto = async (req, res) => {
  try {
    const photo = await Photo.findOneAndDelete({ _id: req.params.id, studio: req.studio._id });

    if (!photo) {
      return res.status(404).json({ success: false, message: "Photo not found or unauthorized" });
    }

    res.status(200).json({ success: true, message: "Photo deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
