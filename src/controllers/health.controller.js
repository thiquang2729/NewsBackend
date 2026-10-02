const ApiResponse = require('../utils/apiResponse');

const healthController = {
  getHealth: (req, res) => {
    return ApiResponse.success(res, {
      message: 'Server đang hoạt động bình thường',
      data: {
        uptime: `${Math.floor(process.uptime())} giây`,
        timestamp: new Date().toISOString(),
        database: global.db ? 'connected' : 'disconnected'
      }
    });
  }
};

module.exports = healthController;

