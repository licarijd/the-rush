const { SORT_ORDER } = require("../../constants/constants")

const touchDownIndicator = 'T'

const stringToNumber = key => parseFloat(key.replace(touchDownIndicator, '').replace(',', ''))

const compareByKey = (key, ord) => (a, b) => {
  let keyA = a[key]
  let keyB = b[key]

  if (keyA.replace)
    keyA = stringToNumber(keyA)

  if (keyB.replace)
    keyB = stringToNumber(keyB)

  const lesser = ord == SORT_ORDER.DESC ? keyA > keyB : keyA < keyB
  const greater = ord == SORT_ORDER.DESC ? keyA < keyB : keyA > keyB

  if (lesser)
    return -1
  
  if (greater)
    return 1

  return 0
}

const filterNameByString = (record, filterString) => record.Player.toLowerCase().startsWith(filterString.toLowerCase())

module.exports = {
  compareByKey,
  filterNameByString
}