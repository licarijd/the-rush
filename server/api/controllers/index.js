const Express = require('express');
const HttpStatus = require('http-status-codes');
const rushStatsController = require('./RushStatsController');
const Error = require('../models/Error');
const { getRushStats } = require('../services/RushStatsService');

const router = Express.Router();

router.use('/nfl-rush-stats', rushStatsController);

router.get('*', (req, res) => {
  new Error(HttpStatus.NOT_FOUND, 'URL does not exist').send(res);
});

module.exports = router;

getRushStats()