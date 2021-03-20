const Express = require('express');
const router = Express.Router();
const { getPage, getRushStats, sortRushStats, filterRushStats } = require("../services/RushStatsService");
const { VALID_SORT_KEYS } = require("../../constants/constants");
const httpStatus = require('http-status');
const Error = require('../models/Error');

router.get('*', async (request, response) => {
  const { sortKey, filterString } = request.query
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
    let statsCache = await getRushStats()
    let records = statsCache && statsCache.records
    let results = [...records]

    const rushStatsSata = {}
    rushStatsSata.cacheKey = statsCache && statsCache.cacheKey
    
    if (filterString)
      results = filterRushStats(filterString, results)

    if (sortKey)
      results = sortRushStats(sortKey, results)
  
    if (page || page === 0) {
      const totalPages = Math.ceil(results.length / pageSize)
      const isFinalPage = (page + 1) >= totalPages

      rushStatsSata.isFinalPage = isFinalPage

      results = getPage(results, page, pageSize)
    }

    rushStatsSata.results = results

    response.send(rushStatsSata)
  } catch (e) {
    console.log(e)
    response.send(new Error(500));
  }
});

module.exports = router;