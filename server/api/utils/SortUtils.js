const touchDownIndicator = 'T'

const stringToNumber = key => parseFloat(key.replace(touchDownIndicator, '').replace(',', ''))

const compareByKey = key => (a, b) => {
  let keyA = a[key]
  let keyB = b[key]

  if (keyA.replace)
    keyA = stringToNumber(keyA)

  if (keyB.replace)
    keyB = stringToNumber(keyB)

  if (keyA > keyB)
    return -1
  
  if (keyA < keyB)
    return 1

  return 0
}

const filterNameByString = (record, filterString) => record.Player.startsWith(filterString)

module.exports = {
  compareByKey,
  filterNameByString
}