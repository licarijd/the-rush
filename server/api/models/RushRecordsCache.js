const { TIME_ONE_MINUTE } = require("../../constants/constants")

class RushRecordsCache {
  constructor(records, cacheTime = TIME_ONE_MINUTE) {
    this.cacheKey = new Date().getTime()
    this.expiry = new Date().getTime() + cacheTime
    this.records = records
    this.size = records.length
  }

  isExpired() {
    return new Date().getTime() >= this.expiry
  }
}

module.exports = RushRecordsCache