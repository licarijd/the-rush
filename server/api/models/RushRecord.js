class RushRecord {
  constructor(rushData) {
    this.Player = rushData.Player
    this.Team = rushData.Team
    this.Pos = rushData.Pos
    this.Att = rushData.Att
    this.Att_G = rushData['Att/G']
    this.Yds = rushData.Yds
    this.Avg = rushData.Avg
    this.Yds_G = rushData['Yds/G']
    this.TD = rushData.TD
    this.Lng = rushData.toString()
    this.first = rushData['1st']
    this.firstPercent = rushData['1st%']
    this.twentyPlus = rushData['20+']
    this.fortyPlus = rushData['40+']
    this.FUM = rushData.FUM
  }
}

module.exports = RushRecord