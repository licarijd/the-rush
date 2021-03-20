import { addAllRecordsJson, ADD_RUSH_RECORDS_JSON, resetRushRecords, RESET_RUSH_RECORDS, ADD_RUSH_RECORD_PAGE, CLEAR_ALL_RECORDS, addPage } from "../RushRecordsActions"

describe('RushRecords', () => {

  it(`creates an ${ADD_RUSH_RECORD_PAGE} action`, () => {
    const type = ADD_RUSH_RECORD_PAGE
    const page = 1
    const records = [{a: 2}, {b: 1}]
    const isFinalPage = true
    const expectedAction = {
      type,
      page,
      records,
      isFinalPage
    }

    expect(addPage(1, records, isFinalPage)).toEqual(expectedAction)
  })

  it(`creates an ${ADD_RUSH_RECORDS_JSON} action`, () => {
    const type = ADD_RUSH_RECORDS_JSON
    const records = [{a: 2}, {b: 1}]
    const expectedAction = {
      type,
      records
    }

    expect(addAllRecordsJson(records)).toEqual(expectedAction)
  })
})