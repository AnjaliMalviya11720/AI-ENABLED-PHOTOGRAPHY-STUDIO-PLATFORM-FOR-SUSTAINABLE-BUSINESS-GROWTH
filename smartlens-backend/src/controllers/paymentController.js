const Payment = require("../models/Payment");
const Studio = require("../models/Studio");

exports.createPayment = async (req, res) => {
  try {
    const studio = req.studio;

    const PREMIUM_PRICE = 999;

   
    const payment = await Payment.create({
      studio: studio._id,
      amount: PREMIUM_PRICE,
      status: "success", 
      transactionId: "TXN_" + Date.now(),
    });

    
    studio.subscriptionPlan = "premium";
    await studio.save();

    res.status(200).json({
      success: true,
      message: "Payment successful. Plan upgraded to premium.",
      data: {
        subscriptionPlan: studio.subscriptionPlan,
        paymentId: payment._id,
        transactionId: payment.transactionId,
      },
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getPaymentHistory = async (req, res) => {
  try {
    const data = await Payment.find({ studio: req.studio._id }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getEarningsSummary = async (req, res) => {
  try {
    const payments = await Payment.find({
      studio: req.studio._id,
      status: "success",
    });
    const totalEarnings = payments.reduce((sum, payment) => sum + payment.amount, 0);
    return res.status(200).json({
      success: true,
      data: {
        totalEarnings,
        totalTransactions: payments.length,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

