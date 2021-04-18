import { DARK_MODE, LIGHT_MODE } from "../../actions/DarkModeActions"
import mode from '../DarkModeReducer'

describe('Rush Records Reducer', () => {

  const initialState = {
    mode: 'light'
  }

  it('should handle the default state', () => {

    const state = mode(undefined, {})

    expect(state).toEqual(initialState)
  })

  it(`should handle ${DARK_MODE}`, () => {

    const action = { type: DARK_MODE }
    const state = mode(undefined, action)
    const expectedState = {
      mode: 'dark'
    }

    expect(state).toEqual(expectedState)
  })

  it(`should handle ${LIGHT_MODE}`, () => {

    const action = { type: LIGHT_MODE }
    const state = mode(undefined, action)
    const expectedState = {
      mode: 'light'
    }

    expect(state).toEqual(expectedState)
  })
})