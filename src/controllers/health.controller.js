const healthController = {
  getHealth: (req, res) => {
    return res.status(200).json({
      status: 'OK',
      message: 'Server đang hoạt động bình thường',
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    });
  }
};

module.exports = healthController;
