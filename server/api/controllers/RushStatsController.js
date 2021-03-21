const Express = require('express');
const router = Express.Router();
const { getPage, getRushStats, sortRushStats, filterRushStats } = require("../services/RushStatsService");
const { VALID_SORT_KEYS } = require("../../constants/constants");
const httpStatus = require('http-status');
const Error = require('../models/Error');

const getRushStatsData = async (filterString, sortKey, page, pageSize) => {
  let statsCache = await getRushStats()
  let records = statsCache && statsCache.records

  const rushStatsData = {}
  const results = prepareRecords(records, filterString, sortKey)
  const isValidPage = (page || page === 0)

  rushStatsData.cacheKey = statsCache && statsCache.cacheKey
  rushStatsData.isFinalPage = isValidPage ? isFinalPage(page, pageSize, results) : false

  const resultsPage = isValidPage ? getPage(results, page, pageSize) : results

  rushStatsData.results = resultsPage

  return rushStatsData
}

const prepareRecords = (records, filterString, sortKey) => {
  let results = [...records]
  if (filterString)
    results = filterRushStats(filterString, results)

  if (sortKey)
    results = sortRushStats(sortKey, results)

  return results
}

const isFinalPage = (page, pageSize, results) => {
  const totalPages = Math.ceil(results.length / pageSize)
  return (page + 1) >= totalPages
}

router.get('*', async (request, response) => {
  const { sortKey } = request.query
  let filterString = request.query.filterString && request.query.filterString.replace(/[^A-Za-z]+/g, '')
  let { page, pageSize } = request.query

  if (page && !/^\d+$/.test(page)) {
    new Error(httpStatus.BAD_REQUEST, 'page must be a number').send(response);
    return
  }

  if (page && !/^\d+$/.test(pageSize)) {
    new Error(httpStatus.BAD_REQUEST, 'pageSize must be a number').send(response);
    return
  }

  if (!VALID_SORT_KEYS.has(sortKey)) {
    new Error(httpStatus.BAD_REQUEST, 'Invalid sort key').send(response);
    return
  }

  page = parseInt(request.query.page)
  pageSize = parseInt(request.query.pageSize)

  try {
    const rushStatsData = await getRushStatsData(filterString, sortKey, page, pageSize)

    response.send(rushStatsData)
  } catch (e) {
    console.log(e)
    response.send(new Error(500));
  }
});

module.exports = router;