import { darkMode, DARK_MODE, dayMode, LIGHT_MODE } from "../DarkModeActions"

describe('RushRecords', () => {

    it(`creates an ${DARK_MODE} action`, () => {

        expect(darkMode()).toEqual({ type: DARK_MODE })
    })

    it(`creates an ${LIGHT_MODE} action`, () => {

        expect(dayMode()).toEqual({ type: LIGHT_MODE })
    })
})