/**
 * Integration Tests - Rush Stats Controller
*/

import request from 'supertest'
import testAPI from './testAPI'
import HTTPStatus from 'http-status'
import { API_STATUS } from '../../../constants/constants'
import { compareByKey } from '../../utils/SortUtils'

const path = '/api/nfl-rush-stats'
const expectedRushRecord = {
  Player: expect.any(String),
  Team: expect.any(String),
  Pos: expect.any(String),
  Att: expect.any(Number),
  Att_G: expect.any(Number),
  Yds: expect.any(Number),
  Avg: expect.any(Number),
  Yds_G: expect.any(Number),
  TD: expect.any(Number),
  Lng: expect.any(String),
  first: expect.any(Number),
  firstPercent: expect.any(Number),
  twentyPlus: expect.any(Number),
  fortyPlus: expect.any(Number),
  FUM: expect.any(Number)
}
const expectedData = expect.arrayContaining([expect.objectContaining(expectedRushRecord)])
const expectedBody = {
  cacheKey: expect.any(Number),
  isFinalPage: expect.any(Boolean),
  results: expectedData
}
const datasetSize = 326

describe('Rush Stats controller', () => {
  describe('Bad requests', () => {
    test('It should return a 400 response with an invalid sort key', done => {
      request(testAPI).get(`${path}?sortKey=TDI`).then(res => {
        expect(res.statusCode).toBe(HTTPStatus.BAD_REQUEST)
        expect(res.body.status).toBe('error')
        expect(res.body.message).toBe(API_STATUS.INVALID_SORT_KEY)
        done()
      })
    })
    test('It should return a 400 response with a missing sort key', done => {
      request(testAPI).get(`${path}`).then(res => {
        expect(res.statusCode).toBe(HTTPStatus.BAD_REQUEST)
        expect(res.body.status).toBe('error')
        expect(res.body.message).toBe(API_STATUS.INVALID_SORT_KEY)
        done()
      })
    })
    test('It should return a 400 response with an invalid page', done => {
      request(testAPI).get(`${path}?sortKey=TD&page=2a`).then(res => {
        expect(res.statusCode).toBe(HTTPStatus.BAD_REQUEST)
        expect(res.body.status).toBe('error')
        expect(res.body.message).toBe(API_STATUS.INVALID_PAGE)
        done()
      })
    })
    test('It should return a 400 response with an invalid pageSize', done => {
      request(testAPI).get(`${path}?sortKey=TD&page=2&pageSize=*`).then(res => {
        expect(res.statusCode).toBe(HTTPStatus.BAD_REQUEST)
        expect(res.body.status).toBe('error')
        expect(res.body.message).toBe(API_STATUS.INVALID_PAGE_SIZE)
        done()
      })
    })
    test('It should return a 400 response when page is present, but pageSize is not', done => {
      request(testAPI).get(`${path}?sortKey=TD&page=2`).then(res => {
        expect(res.statusCode).toBe(HTTPStatus.BAD_REQUEST)
        expect(res.body.status).toBe('error')
        expect(res.body.message).toBe(API_STATUS.MISSING_PAGE_SIZE)
        done()
      })
    })
  })
  describe('Valid requests', () => {
    describe('Sorting', () => {
      test('It should return all results sorted by Total Rushing Touchdowns', done => {
        request(testAPI).get(`${path}?sortKey=TD`).then(res => {
          const { results } = res.body
          expect(res.statusCode).toBe(HTTPStatus.OK)
          expect(results.length).toBe(datasetSize)
          expect(res.body).toEqual(expect.objectContaining(expectedBody))

          for (let i = 1; i < results.length; i++) {
            expect(results[i].TD).toBeLessThanOrEqual(results[i - 1].TD)
          }

          done()
        })
      })
      test('It should return all results sorted by Total Rushing Yards', done => {
        const touchDownIndicator = 'T'
        const stringToNumber = key => parseFloat(key.replace(touchDownIndicator, '').replace(',', ''))

        request(testAPI).get(`${path}?sortKey=Yds`).then(res => {
          const { results } = res.body
          expect(res.statusCode).toBe(HTTPStatus.OK)
          expect(results.length).toBe(datasetSize)
          expect(res.body).toEqual(expect.objectContaining(expectedBody))

          for (let i = 1; i < results.length; i++) {
            let keyA = results[i - 1].Yds
            let keyB = results[i].Yds

            if (keyA.replace)
              keyA = stringToNumber(keyA)

            if (keyB.replace)
              keyB = stringToNumber(keyB)

            expect(keyB).toBeLessThanOrEqual(keyA)
          }

          done()
        })
      })
      test('It should return all results sorted by Longest Rush', done => {
        request(testAPI).get(`${path}?sortKey=Lng`).then(res => {
          const { results } = res.body
          expect(res.statusCode).toBe(HTTPStatus.OK)
          expect(results.length).toBe(datasetSize)
          expect(res.body).toEqual(expect.objectContaining(expectedBody))

          for (let i = 1; i < results.length; i++) {
            const compareResult = compareByKey('Lng')(results[i - 1], results[i])
            expect(compareResult.toString()).toMatch(/^0|-1$/)
          }

          done()
        })
      })
    })
    describe('Filtering', () => {
      test('It should return all results sorted by Total Rushing Touchdowns, and filtered by the string john', done => {
        request(testAPI).get(`${path}?sortKey=TD&filterString=john`).then(res => {
          const { results } = res.body
          expect(res.statusCode).toBe(HTTPStatus.OK)
          expect(results.length).toBe(3)
          expect(res.body).toEqual(expect.objectContaining(expectedBody))

          for (let i = 1; i < results.length; i++) {
            expect(results[i].TD).toBeLessThanOrEqual(results[i - 1].TD)
          }

          done()
        })
      })
      test('It should return all results sorted by Total Rushing Yards, and filtered by the string tom', done => {
        const touchDownIndicator = 'T'
        const stringToNumber = key => parseFloat(key.replace(touchDownIndicator, '').replace(',', ''))

        request(testAPI).get(`${path}?sortKey=Yds&filterString=tom`).then(res => {
          const { results } = res.body
          expect(res.statusCode).toBe(HTTPStatus.OK)
          expect(results.length).toBe(3)
          expect(res.body).toEqual(expect.objectContaining(expectedBody))

          for (let i = 1; i < results.length; i++) {
            let keyA = results[i - 1].Yds
            let keyB = results[i].Yds

            if (keyA.replace)
              keyA = stringToNumber(keyA)

            if (keyB.replace)
              keyB = stringToNumber(keyB)

            expect(keyB).toBeLessThanOrEqual(keyA)
          }

          done()
        })
      })
      test('It should return all results sorted by Longest Rush, and filtered by the string rob', done => {
        request(testAPI).get(`${path}?sortKey=Lng&filterString=Rob`).then(res => {
          const { results } = res.body
          expect(res.statusCode).toBe(HTTPStatus.OK)
          expect(results.length).toBe(5)
          expect(res.body).toEqual(expect.objectContaining(expectedBody))

          for (let i = 1; i < results.length; i++) {
            const compareResult = compareByKey('Lng')(results[i - 1], results[i])
            expect(compareResult.toString()).toMatch(/^0|-1$/)
          }

          done()
        })
      })
    })
    describe('Paging', () => {
      test('It should return a page of size 30 when results sorted by Longest Rush', done => {
        request(testAPI).get(`${path}?sortKey=Lng&page=3&pageSize=30`).then(res => {
          const { results } = res.body
          expect(res.statusCode).toBe(HTTPStatus.OK)
          expect(results.length).toBe(30)
          expect(res.body).toEqual(expect.objectContaining(expectedBody))

          for (let i = 1; i < results.length; i++) {
            const compareResult = compareByKey('Lng')(results[i - 1], results[i])
            expect(compareResult.toString()).toMatch(/^0|-1$/)
          }

          done()
        })
      })
      test('It should return 3 results with a pageSize of 10 with results sorted by Total Rushing Yards and filtered by tom', done => {
        const touchDownIndicator = 'T'
        const stringToNumber = key => parseFloat(key.replace(touchDownIndicator, '').replace(',', ''))

        request(testAPI).get(`${path}?sortKey=Yds&filterString=tom&page=0&pageSize=10`).then(res => {
          const { results } = res.body
          expect(res.statusCode).toBe(HTTPStatus.OK)
          expect(results.length).toBe(3)
          expect(res.body).toEqual(expect.objectContaining(expectedBody))

          for (let i = 1; i < results.length; i++) {
            let keyA = results[i - 1].Yds
            let keyB = results[i].Yds

            if (keyA.replace)
              keyA = stringToNumber(keyA)

            if (keyB.replace)
              keyB = stringToNumber(keyB)

            expect(keyB).toBeLessThanOrEqual(keyA)
          }

          done()
        })
      })
      test('It indicate that a page is the last page when the page size is 10', done => {
        request(testAPI).get(`${path}?sortKey=Yds&page=32&pageSize=10`).then(res => {
          const { results, isFinalPage } = res.body
          expect(res.statusCode).toBe(HTTPStatus.OK)
          expect(results.length).toBe(6)
          expect(isFinalPage).toBe(true)
          //expect(res.body).toEqual(expect.objectContaining(expectedBody))

          done()
        })
      })
      test('It indicate that a page is not the last page when the page size is 10', done => {
        request(testAPI).get(`${path}?sortKey=Yds&page=31&pageSize=10`).then(res => {
          const { results, isFinalPage } = res.body
          expect(res.statusCode).toBe(HTTPStatus.OK)
          expect(results.length).toBe(10)
          expect(isFinalPage).toBe(false)
          expect(res.body).toEqual(expect.objectContaining(expectedBody))

          done()
        })
      })
      test('It indicate that a page is the last page when the page size is 30', done => {
        request(testAPI).get(`${path}?sortKey=Yds&page=10&pageSize=30`).then(res => {
          const { results, isFinalPage } = res.body
          expect(res.statusCode).toBe(HTTPStatus.OK)
          expect(results.length).toBe(26)
          expect(isFinalPage).toBe(true)
          expect(res.body).toEqual(expect.objectContaining(expectedBody))

          done()
        })
      })
    })
  })
})