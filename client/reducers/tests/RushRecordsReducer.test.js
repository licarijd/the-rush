import { ADD_RUSH_RECORDS_JSON, ADD_RUSH_RECORD_PAGE, UPDATE_CACHE_KEY, CLEAR_ALL_RECORDS } from '../../actions/RushRecordsActions'
import rushRecords from '../RushRecordsReducer'

describe('Rush Records Reducer', () => {

  const initialState = {
    cacheKey: ''
  }

  it('should handle the default state', () => {

    const state = rushRecords(undefined, {})

    expect(state).toEqual(initialState)
  })

  it(`should handle the ${ADD_RUSH_RECORD_PAGE} action`, () => {

    const action = {
      type: ADD_RUSH_RECORD_PAGE,
      page: 2,
      records: [{a: 2}, {b: 1}],
      isFinalPage: true
    }
    const initialState = {
      cacheKey: '2615607228',
      1: {
        records: [{a: 0}, {b: 0}],
        isFinalPage: true
      }
    }
    const expectedState = {
      cacheKey: '2615607228',
      1: {
        records: [{a: 0}, {b: 0}],
        isFinalPage: true
      },
      2: {
        records: [{a: 2}, {b: 1}],
        isFinalPage: true
      }
    }
    const state = rushRecords(initialState, action)

    expect(state).toEqual(expectedState)
  })

  it(`should handle the ${UPDATE_CACHE_KEY} action`, () => {

    const action = {
      type: UPDATE_CACHE_KEY,
      cacheKey: '3615607228'
    }
    const initialState = {
      cacheKey: ''
    }
    const expectedState = {
      cacheKey: '3615607228'
    }

    const state = rushRecords(initialState, action)

    expect(state).toEqual(expectedState)
  })

  it(`should handle the ${ADD_RUSH_RECORDS_JSON} action`, () => {
    const action = {
      type: ADD_RUSH_RECORDS_JSON,
      records: [{a: 4}, {b: 5}, {c: 8}, {d: 9}]
    }
    const initialState = {
      cacheKey: '2615607228',
      1: {
        records: [{a: 2}, {b: 1}],
        isFinalPage: false
      },
      2: {
        records: [{a: 1}, {b: 1}],
        isFinalPage: true
      }
    }
    const expectedState = {
      cacheKey: '2615607228',
      1: {
        records: [{a: 2}, {b: 1}],
        isFinalPage: false
      },
      2: {
        records: [{a: 1}, {b: 1}],
        isFinalPage: true
      },
      allRecords: [{a: 4}, {b: 5}, {c: 8}, {d: 9}]
    }

    const state = rushRecords(initialState, action)

    expect(state).toEqual(expectedState)
  })

  it(`should handle the ${CLEAR_ALL_RECORDS} action`, () => {
    const action = {
      type: CLEAR_ALL_RECORDS
    }
    const initialState = {
      cacheKey: '2615607228',
      1: {
        records: [{a: 2}, {b: 1}],
        isFinalPage: false
      },
      2: {
        records: [{a: 1}, {b: 1}],
        isFinalPage: true
      }
    }
    const expectedState = {
      cacheKey: ''
    }

    const state = rushRecords(initialState, action)

    expect(state).toEqual(expectedState)
  })
})