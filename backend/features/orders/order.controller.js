const orderService = require("./order.service");

const getFarmerOrders = async (req, res) => {
  try {
    const orders = await orderService.getOrdersForFarmer(req.user.id);
    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getBuyerOrders = async (req, res) => {
  try {
    const orders = await orderService.getOrdersForBuyer(req.user.id);
    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await orderService.getOrderById(req.params.id, req.user.id, req.user.role);
    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await orderService.updateOrderStatus(
      req.params.id,
      status,
      req.user.id,
      req.user.role
    );
    res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      order,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const payOrder = async (req, res) => {
  try {
    const { paymentMode } = req.body;
    const order = await orderService.executePayment(req.params.id, paymentMode, req.user.id);
    res.status(200).json({
      success: true,
      message: "Payment processed successfully via sandbox",
      order,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getFarmerOrders,
  getBuyerOrders,
  getOrderById,
  updateOrderStatus,
  payOrder,
};
