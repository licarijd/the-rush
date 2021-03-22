import Express from 'express'
const rushStatsController = require('../RushStatsController');

const testAPI = Express()

testAPI.use(Express.urlencoded())
testAPI.use(Express.json()) 

const router = Express.Router()

router.use('/nfl-rush-stats', rushStatsController);

testAPI.use('/api', router)

export default testAPI