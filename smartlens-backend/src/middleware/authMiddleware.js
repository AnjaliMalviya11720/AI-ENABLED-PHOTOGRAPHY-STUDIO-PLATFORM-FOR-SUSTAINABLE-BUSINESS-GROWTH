const jwt = require("jsonwebtoken");
const Studio = require("../models/Studio");
const Customer = require("../models/Customer");

exports.protect = async (req, res, next) => {
  try {
    if (
      !req.headers.authorization ||
      !req.headers.authorization.startsWith("Bearer")
    ) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, no token provided",
      });
    }

    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const role = decoded.role || "studio";

    if (role === "customer") {
      req.customer = await Customer.findById(decoded.id).select("-password");
      if (!req.customer) {
        return res.status(401).json({
          success: false,
          message: "Not authorized, customer not found",
        });
      }
    } else {
      req.studio = await Studio.findById(decoded.id).select("-password");
      if (!req.studio) {
        return res.status(401).json({
          success: false,
          message: "Not authorized, studio not found",
        });
      }
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, token failed",
    });
  }
};

exports.requireStudio = (req, res, next) => {
  if (req.studio) return next();
  return res.status(403).json({
    success: false,
    message: "Studio account required for this action",
  });
};

exports.requireCustomer = (req, res, next) => {
  if (req.customer) return next();
  return res.status(403).json({
    success: false,
    message: "Customer account required for this action",
  });
};

exports.isAdmin = (req, res, next) => {
  if (req.studio && req.studio.role === "admin") {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin only.",
    });
  }
};
