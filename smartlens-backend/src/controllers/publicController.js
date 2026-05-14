const Studio = require("../models/Studio");
const Photo = require("../models/Photo");

exports.getPublicPortfolio = async (req, res) => {
  try {
    const studio = await Studio.findById(req.params.id).select("name email phone");
    if (!studio) {
      return res.status(404).json({ success: false, message: "Studio not found" });
    }

    const photos = await Photo.find({ studio: studio._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        studio,
        photos
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: "Invalid Request or Studio ID" });
  }
};

exports.getPhotographers = async (req, res) => {
  try {
    const { location, maxPrice, availabilityStatus } = req.query;
    const query = { role: "studio" };

    if (location) {
      query.location = { $regex: location, $options: "i" };
    }
    if (availabilityStatus) {
      query.availabilityStatus = availabilityStatus;
    }
    if (maxPrice) {
      query.pricing = { $lte: Number(maxPrice) };
    }

    const data = await Studio.find(query).select(
      "name email phone location pricing experience profilePhoto availabilityStatus"
    );
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
