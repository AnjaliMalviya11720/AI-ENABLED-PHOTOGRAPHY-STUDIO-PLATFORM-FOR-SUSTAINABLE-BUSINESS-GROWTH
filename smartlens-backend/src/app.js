const express = require("express");
const cors = require("cors");

const studioRoutes = require("./routes/studioRoutes");
const photoRoutes = require("./routes/photoRoutes");   
const paymentRoutes = require("./routes/paymentRoutes");
const adminRoutes = require("./routes/adminRoutes");
const bookingRoutes = require("./routes/bookingRoutes"); 
const publicRoutes = require("./routes/publicRoutes");   
const albumRoutes = require("./routes/albumRoutes");
const customerRoutes = require("./routes/customerRoutes");


const app = express();

const path = require("path");


app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));


app.use("/api/studios", studioRoutes);
app.use("/api/photos", photoRoutes);   
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/customers", customerRoutes);


app.get("/", (req, res) => {
  res.json({ message: "SmartLens API Running 🚀" });
});

module.exports = app;
