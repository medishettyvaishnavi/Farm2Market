const ngoService = require("./ngo.service");

const getNgoDashboard = async (req, res) => {
  try {
    const stats = await ngoService.getNgoDashboardStats();
    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getNgoDashboard,
};
