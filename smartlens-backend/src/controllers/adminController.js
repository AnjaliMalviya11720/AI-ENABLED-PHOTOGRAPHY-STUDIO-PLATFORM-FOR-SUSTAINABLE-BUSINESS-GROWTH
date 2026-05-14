const Studio = require("../models/Studio");
const Photo = require("../models/Photo");
const Payment = require("../models/Payment");

exports.getAdminDashboard = async (req, res) => {
  try {

    const totalStudios = await Studio.countDocuments();
    const totalPhotos = await Photo.countDocuments();

    const premiumStudios = await Studio.countDocuments({ subscriptionPlan: "premium" });
    const freeStudios = await Studio.countDocuments({ subscriptionPlan: "free" });

    const payments = await Payment.find({ status: "success" });

    const totalRevenue = payments.reduce((acc, payment) => acc + payment.amount, 0);

    const conversionRate =
      totalStudios > 0
        ? ((premiumStudios / totalStudios) * 100).toFixed(2)
        : 0;

        
   

    const mostActiveStudioData = await Photo.aggregate([
      {
        $group: {
          _id: "$studio",
          photoCount: { $sum: 1 }
        }
      },
      {
        $sort: { photoCount: -1 }
      },
      {
        $limit: 1
      }
    ]);

    let mostActiveStudio = null;

    if (mostActiveStudioData.length > 0) {
      const studioInfo = await Studio.findById(mostActiveStudioData[0]._id);

      mostActiveStudio = {
        name: studioInfo.name,
        email: studioInfo.email,
        photoCount: mostActiveStudioData[0].photoCount
      };
    }




    const now = new Date();

    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const thisMonthPayments = payments.filter(
      (p) => p.createdAt >= startOfThisMonth
    );

    const lastMonthPayments = payments.filter(
      (p) => p.createdAt >= startOfLastMonth && p.createdAt <= endOfLastMonth
    );

    const thisMonthRevenue = thisMonthPayments.reduce((acc, p) => acc + p.amount, 0);
    const lastMonthRevenue = lastMonthPayments.reduce((acc, p) => acc + p.amount, 0);

    let revenueGrowth = 0;

    if (lastMonthRevenue > 0) {
      revenueGrowth = (
        ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) *
        100
      ).toFixed(2);
    }

    res.status(200).json({
      success: true,
      data: {
        totalStudios,
        totalPhotos,
        premiumStudios,
        freeStudios,
        totalRevenue,
        conversionRate: conversionRate + "%",
        thisMonthRevenue,
        lastMonthRevenue,
        revenueGrowth: revenueGrowth + "%",
        mostActiveStudio
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


