const RushRecord = require("../models/RushRecord")
const RushRecordsCache = require("../models/RushRecordsCache")
const requestRushStats = require("../repositories/RushStatsRepository")
const { filterNameByString, compareByKey } = require("../utils/SortUtils")

let RUSH_STATS_CACHE

const getRushStats = async () => {
  if (!RUSH_STATS_CACHE || RUSH_STATS_CACHE.isExpired()) {
    console.log("Creating NFL Rush Stats Cache...")
    await createRushStatsCache()
    console.log("NFL Rush Stats Cache Complete")
  }
  return RUSH_STATS_CACHE
}

const sortRushStats = (sortKey, records) => records.sort(compareByKey(sortKey))

const filterRushStats = (filterString, records) => records.filter(record => filterNameByString(record, filterString))

const getPage = (records, page, pageSize = 10) => records.slice(page * pageSize, (page * pageSize) + pageSize)

const createRushStatsCache = async () => {
  let rushStats = []
  try {
    rushStats = await requestRushStats()
  } catch (e) {
    console.log(e)
  }
  const records = rushStats.map(rushStat => new RushRecord(rushStat))
  RUSH_STATS_CACHE = new RushRecordsCache(records)
}

module.exports = {
  getRushStats,
  createRushStatsCache,
  sortRushStats,
  filterRushStats,
  getPage
}