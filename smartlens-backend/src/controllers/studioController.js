const bcrypt = require("bcryptjs");
const Studio = require("../models/Studio");
const jwt = require("jsonwebtoken");
const Photo = require("../models/Photo");
const Booking = require("../models/Booking");
const Payment = require("../models/Payment");

exports.registerStudio = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        const existingStudio = await Studio.findOne({ email });
        if (existingStudio) {
            return res.status(400).json({
                success: false,
                message: "Studio already exists with this email"
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const createdStudio = await Studio.create({
            name,
            email,
            password: hashedPassword,
            phone,
            subscriptionPlan: "free"
        });

        const studio = await Studio.findById(createdStudio._id);

        res.status(201).json({
            success: true,
            message: "Studio registered successfully",
            data: studio
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.loginStudio = async (req, res) => {
    try {
        const { email, password } = req.body;

        const studio = await Studio.findOne({ email }).select("+password");

        if (!studio) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const isMatch = await bcrypt.compare(password, studio.password);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        
        const token = jwt.sign(
            {
                id: studio._id,
                role: studio.role === "admin" ? "admin" : "studio",
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            studio: {
                _id: studio._id,
                name: studio.name,
                email: studio.email,
                role: studio.role
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


exports.getProfile = async (req, res) => {
  res.status(200).json({
    success: true,
    data: req.studio
  });
};


exports.createPhoto = async (req, res) => {
  try {
    const { title, imageUrl, category } = req.body;

    const photo = await Photo.create({
      title,
      imageUrl,
      category,
      studio: req.studio._id   
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

exports.upgradePlan = async (req, res) => {
  try {
    const studio = await Studio.findById(req.studio.id);

    if (!studio) {
      return res.status(404).json({
        success: false,
        message: "Studio not found"
      });
    }

    
    if (studio.subscriptionPlan === "premium") {
      return res.status(400).json({
        success: false,
        message: "You are already on premium plan"
      });
    }

    studio.subscriptionPlan = "premium";
    await studio.save();

    res.status(200).json({
      success: true,
      message: "Plan upgraded to premium successfully",
      data: {
        subscriptionPlan: studio.subscriptionPlan
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const allowedFields = [
      "name",
      "phone",
      "location",
      "pricing",
      "experience",
      "profilePhoto",
      "availabilityStatus",
    ];

    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const studio = await Studio.findByIdAndUpdate(req.studio._id, updates, {
      new: true,
    });

    return res.status(200).json({ success: true, data: studio });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Both current and new password are required" });
    }

    const studio = await Studio.findById(req.studio._id).select("+password");
    const isMatch = await bcrypt.compare(currentPassword, studio.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Current password is incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    studio.password = await bcrypt.hash(newPassword, salt);
    await studio.save();

    return res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPhotographerDashboard = async (req, res) => {
  try {
    const studioId = req.studio._id;

    const allBookings = await Booking.find({ studio: studioId }).sort({ createdAt: -1 });
    const pendingBookings = allBookings.filter((booking) => booking.status === "pending").length;
    const confirmedBookings = allBookings.filter((booking) => booking.status === "confirmed").length;
    const recentBookings = allBookings.slice(0, 5);

    const payments = await Payment.find({ studio: studioId, status: "success" });
    const earnings = payments.reduce((sum, payment) => sum + payment.amount, 0);

    return res.status(200).json({
      success: true,
      data: {
        totalBookings: allBookings.length,
        pendingBookingRequests: pendingBookings,
        confirmedBookings,
        earnings,
        recentBookings,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
