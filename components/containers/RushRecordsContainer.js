import React from "react";
import { connect } from 'react-redux'
import { fetchGet } from "../../client/api/nflRushStatsAPI";
import { addAllRecordsJson, addPage, resetRushRecords } from "../../client/actions/RushRecordsActions"
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux'
import { ExportToCsv } from 'export-to-csv';

const directions = {
  FORWARD: 'FORWARD',
  BACK: 'BACK'
}
const rushStatsEndpoint = 'nfl-rush-stats'
const defaultPageSize = 10
class RushRecordsContainer extends React.Component {

  constructor() {
    super()
    this.state = {
      page: {key: 'page', value: 0},
      pageSize: {key: 'pageSize', value: defaultPageSize},
      sortKey: {key: 'sortKey', value: 'Yds'},
      filterString: {key: 'filterString', value: ''},
      shouldUpdatePage: false,
      isFinalPage: false,
      newResults: false
    }
  }

  componentDidMount() {
    this.updatePage()
  }

  componentDidUpdate() {
    if (this.state.shouldUpdatePage || this.state.newResults)
      this.updatePage()
  }

  async updatePage() {
    const { page, newResults } = this.state
    const { rushRecords } = this.props
    const pageExists = rushRecords[page.value] && rushRecords[page.value].records && rushRecords[page.value].records.length

    if (newResults) {
      const {results, isFinalPage, cacheKey} = await this.fetchPage()

      this.setState({ newResults: false, isFinalPage })
      this.resetDataStore(this.state.page.value, results, cacheKey, isFinalPage)
    } else if (!pageExists) {
      const pageData = await this.fetchPage()
      this.setState({ isFinalPage: pageData.isFinalPage })
      this.updateDataStore(pageData)
    }

    this.setState({ shouldUpdatePage: false })
  }

  updateDataStore(pageData, shouldUpdateAllRecords) {
    const { results, isFinalPage, cacheKey } = pageData
    const { rushRecords } = this.props
    const shouldClearStore = cacheKey != rushRecords.cacheKey

    if (shouldUpdateAllRecords) {
      if (shouldClearStore) {
        const page = this.state.page.value
        const pageResults = shouldUpdateAllRecords 
          ? results.slice(page * defaultPageSize, (page * defaultPageSize) + defaultPageSize)
          : results
        this.resetDataStore(this.state.page.value, pageResults, cacheKey, shouldUpdateAllRecords ? this.state.isFinalPage : isFinalPage)
      } else {
        this.props.dispatch(addAllRecordsJson(results))
      }
    } else {
      this.props.dispatch(addPage(this.state.page.value, results, shouldUpdateAllRecords ? this.state.isFinalPage : isFinalPage))
    }
  }

  resetDataStore(page, records, cacheKey, isFinalPage) {
    const payload = {
      page,
      records,
      cacheKey,
      isFinalPage
    }
    resetRushRecords(payload)(this.props.dispatch)
  }

  async fetchAllRecords() {
    const { sortKey, filterString } = this.state
    const page = await fetchGet(rushStatsEndpoint, [sortKey, filterString])

    this.props.dispatch(addAllRecordsJson(page.results))
    this.updateDataStore(page, true)

    return page.results
  }

  async fetchPage() {
    const { page, pageSize, sortKey, filterString } = this.state
    return await fetchGet(rushStatsEndpoint, [page, pageSize, sortKey, filterString])
  }

  onInputChange(event) {
    const newState = {}
    const sanitizedString = event.target.value.replace(/[^A-Za-z ]+/g, '')

    newState.filterString = {key: 'filterString', value: sanitizedString}

    if (!sanitizedString) {
      newState.page = {key: 'page', value: 0}
      newState.newResults = true
    }

    this.setState(newState)
  }

  async onSortChange(sortKey) {
    if (sortKey != this.state.sortKey.value) {
      this.setState({
        page: {key: 'page', value: 0},
        sortKey: {key: 'sortKey', value: sortKey},
        newResults: true
      })
    }
  }

  onSearch() {
    this.setState({
      page: {key: 'page', value: 0},
      newResults: true
    })
  }

  onPage(direction) {
    const currentPage = this.state.page.value

    if (direction == directions.FORWARD) {
      this.setState({
        page: {key: 'page', value: currentPage + 1},
        shouldUpdatePage: true
      })
    } else if (direction == directions.BACK) {
      this.setState(
        {page: {key: 'page', value: currentPage - 1},
        shouldUpdatePage: true}
      )
    }
  }

  async onDownload() {
    const allRushRecords = this.props.rushRecords.allRecords || await this.fetchAllRecords()
    const options = { 
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true, 
      showTitle: true,
      title: 'NFL Rush Records',
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true,
      // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
    };
    const csvExporter = new ExportToCsv(options);
    
    csvExporter.generateCsv(allRushRecords)
  }

  render() {
    const { rushRecords } = this.props
    const page = this.state.page.value
    const isFinalPage = rushRecords && rushRecords[page] && rushRecords[page].isFinalPage
    const tableRows = rushRecords && rushRecords[page] && rushRecords[page].records && rushRecords[page].records.map(record =>
      <tr>
        <td> {record.Player} </td>
        <td> {record.Team} </td>
        <td> {record.Pos} </td>
        <td> {record.Att_G} </td>
        <td> {record.Att} </td>
        <td> {record.Yds} </td>
        <td> {record.Avg} </td>
        <td> {record.Yds_G} </td>
        <td> {record.TD} </td>
        <td> {record.Lng} </td>
        <td> {record.first} </td>
        <td> {record.firstPercent} </td>
        <td> {record.twentyPlus} </td>
        <td> {record.fortyPlus} </td>
        <td> {record.FUM} </td>
      </tr>
    )

    return (
      <div className="page">
        <h1> NFL Rush Records </h1>
        <input type="text" id="fname" name="fname" placeholder="Search for a player..." onChange={this.onInputChange.bind(this)}></input>
        <button className="search-button" onClick={this.onSearch.bind(this)}> Search </button>
        <div className="toolbar"> Sort By: 
          <div>
            <span>
              <button
                className={`order-by-button ${this.state.sortKey.value == 'Yds' ? 'highlighted' : ''}`}
                onClick={() => this.onSortChange('Yds')}>
                  Total Rushing Yards
                </button>
              <button
                className={`order-by-button ${this.state.sortKey.value == 'Lng' ? 'highlighted' : ''}`}
                onClick={() => this.onSortChange('Lng')}>
                  Longest Rush
              </button>
              <button
                className={`order-by-button ${this.state.sortKey.value == 'TD' ? 'highlighted' : ''}`}
                onClick={() => this.onSortChange('TD')}>
                  Total Rushing Touchdowns
              </button>
            </span>
          </div>
        </div>
        <div className='results-toolbar'>
          <button className="download-button" onClick={this.onDownload.bind(this)}> Download CSV </button>
          <span className="paging-toolbar">
            {`Page: ${this.state.page.value + 1}`}
            {this.state.page.value > 0 && <button className="paging-button" onClick={() => this.onPage(directions.BACK)}> Previous Page </button>}
            {!isFinalPage && <button className="paging-button" onClick={() => this.onPage(directions.FORWARD)}> Next Page </button>}
          </span>  
        </div>
        <table className='table'>
          <tr>
            <th className='table-header'>Player</th>
            <th className='table-header'>Team</th>
            <th className='table-header'>Position</th>
            <th className='table-header'>Rushing Attempts Average</th>
            <th className='table-header'>Rushing Attempts</th>
            <th className='table-header'>Yards</th>
            <th className='table-header'>Average Rushing Yards</th>
            <th className='table-header'>Rushing Yards Per Game</th>
            <th className='table-header'>Total Rushing Touchdowns</th>
            <th className='table-header'>Longest Rush</th>
            <th className='table-header'>Rushing First Downs</th>
            <th className='table-header'>Rushing First Downs Percentage</th>
            <th className='table-header'>Twenty Plus Yards Each</th>
            <th className='table-header'>Forty Plus Yards Each</th>
            <th className='table-header'>Rushing Fumbles</th>
          </tr>
          { tableRows }
        </table>
      </div>
    );
  }
}

RushRecordsContainer.propTypes = {
  rushRecords: PropTypes.object.isRequired
}

const mapStateToProps = (state, props) => {
  return {
    rushRecords: state.rushRecords
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  dispatch
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(RushRecordsContainer)