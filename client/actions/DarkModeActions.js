export const DARK_MODE = 'DARK_MODE'
export const LIGHT_MODE = 'LIGHT_MODE'

export const dayMode = () => {
  return { type: LIGHT_MODE }
}

export const darkMode = () => {
  return { type: DARK_MODE }
}