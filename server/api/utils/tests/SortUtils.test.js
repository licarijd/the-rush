const { compareByKey, filterNameByString } = require("../SortUtils")

describe('SortUtils', () => {

  describe('compareByKey', () => {

    it(`Returns -1 when the first item's key is lesser than the second`, () => {

      const itemA = {
        key: 2
      }
      const itemB = {
        key: 1
      }
      const itemC = {
        key: '2T'
      }
      const itemD = {
        key: 1
      }

      expect(compareByKey('key')(itemA, itemB)).toEqual(-1)
      expect(compareByKey('key')(itemC, itemD)).toEqual(-1)
    })

    it(`Returns 0 when the first item's key is equal to the second`, () => {

      const itemA = {
        key: 1
      }
      const itemB = {
        key: 1
      }

      expect(compareByKey('key')(itemA, itemB)).toEqual(0)
    })

    it(`Returns 1 when the first item's key is greater than the second`, () => {

      const itemA = {
        key: 2
      }
      const itemB = {
        key: 3
      }
      const itemC = {
        key: 2
      }
      const itemD = {
        key: '13T'
      }

      expect(compareByKey('key')(itemA, itemB)).toEqual(1)
      expect(compareByKey('key')(itemC, itemD)).toEqual(1)
    })
  })

  describe('filterNameByString', () => {

    const record = {
      "Player":"Joe Banyard",
      "Team":"JAX",
      "Pos":"RB",
      "Att":2,
      "Att/G":2,
      "Yds":7,
      "Avg":3.5,
      "Yds/G":7,
      "TD":0,
      "Lng":"7",
      "1st":0,
      "1st%":0,
      "20+":0,
      "40+":0,
      "FUM":0
    }

    it('should return true if a player name begins with the specified character', () => {

      expect(filterNameByString(record, '')).toEqual(true)
      expect(filterNameByString(record, 'J')).toEqual(true)
      expect(filterNameByString(record, 'Joe B')).toEqual(true)
      expect(filterNameByString(record, 'Joe Banyard')).toEqual(true)
    })

    it('should return false if a player name does not begin with the specified character', () => {
      
      expect(filterNameByString(record, 'K')).toEqual(false)
    })
  })
})