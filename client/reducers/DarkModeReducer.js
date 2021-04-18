import { LIGHT_MODE, DARK_MODE } from '../actions/DarkModeActions'

const initialState = {
  mode: 'light'
}

export default (state = initialState, action) => {
  let newState = Object.assign({}, state)

  switch (action.type) {
    case LIGHT_MODE:
      newState = {
        mode: 'light'
      }
      return newState
    case DARK_MODE:
        newState = {
            mode: 'dark'
        }
        return newState
    default:
      return newState
  }
}