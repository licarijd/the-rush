export const ADD_RUSH_RECORD_PAGE = 'ADD_RUSH_RECORD_PAGE'
export const ADD_RUSH_RECORDS_JSON = 'ADD_RUSH_RECORDS_JSON'
export const CLEAR_ALL_RECORDS = 'CLEAR_ALL_RECORDS'
export const UPDATE_CACHE_KEY = 'UPDATE_CACHE_KEY'

const clearRushRecords = () => {
  return {
    type: CLEAR_ALL_RECORDS
  }
}

const updateCacheKey = cacheKey => {
  return {
    type: UPDATE_CACHE_KEY,
    cacheKey
  }
}

export const addPage = (page, records, isFinalPage) => {
  return {
    type: ADD_RUSH_RECORD_PAGE,
    page,
    records,
    isFinalPage
  }
}

export const addAllRecordsJson = (records) => {
  return {
    type: ADD_RUSH_RECORDS_JSON,
    records
  }
}

export const resetRushRecords = (payload) => dispatch => {
  dispatch(clearRushRecords())
  dispatch(updateCacheKey(payload.cacheKey))
  dispatch(addPage(payload.page, payload.records, payload.isFinalPage))
}