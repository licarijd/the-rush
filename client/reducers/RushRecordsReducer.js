import { ADD_RUSH_RECORDS_JSON, ADD_RUSH_RECORD_PAGE, CLEAR_ALL_RECORDS, UPDATE_CACHE_KEY } from '../actions/RushRecordsActions'

export const initialState = {
  cacheKey: ''
}

export default (state = initialState, action) => {
  let newState = Object.assign({}, state)

  switch (action.type) {
    case ADD_RUSH_RECORD_PAGE:
      newState[action.page] = {records: action.records, isFinalPage: action.isFinalPage}
      return newState
    case CLEAR_ALL_RECORDS:
      return initialState
    case UPDATE_CACHE_KEY:
      newState.cacheKey = action.cacheKey
      return newState
    case ADD_RUSH_RECORDS_JSON:
      newState.allRecords = action.records
      return newState
    default:
      return newState
  }
}