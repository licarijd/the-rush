import rushRecords from '../../../../mock-data/rushing.json'
import firstPage from './data/firstPage.json'
import secondPage from './data/secondPage.json'
import lastPage from './data/lastPage.json'
import { getPage } from '../RushStatsService'

describe('SortUtils', () => {

  describe('getPage', () => {

    it(`should return the first and second pages`, () => {

      expect(getPage(rushRecords, 0, 10)).toEqual(firstPage)
      expect(getPage(rushRecords, 1, 10)).toEqual(secondPage)
    })

    it(`should return the final page`, () => {

      expect(getPage(rushRecords, 32, 10)).toEqual(lastPage)
    })
  })
})