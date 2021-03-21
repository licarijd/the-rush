import React from "react";
import { connect } from 'react-redux'
import { fetchGet } from "../../client/api/nflRushStatsAPI";
import { addAllRecordsJson, addPage, resetRushRecords } from "../../client/actions/RushRecordsActions"
import Record from "../Record";
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
      newSortKey: false
    }
  }

  componentDidMount() {
    this.fetchPage()
  }

  componentDidUpdate() {
    if (this.state.shouldUpdatePage || this.state.newSortKey)
      this.fetchPage()
  }

  async fetchPage() {
    const { page, pageSize, sortKey, filterString } = this.state
    const {rushRecords} = this.props
    const pageExists = rushRecords[page.value] && rushRecords[page.value].records && rushRecords[page.value].records.length

    if (!pageExists || this.state.newSortKey) {
      const {results, isFinalPage, cacheKey} = await fetchGet(rushStatsEndpoint, [page, pageSize, sortKey, filterString])
      const shouldClearStore = cacheKey != rushRecords.cacheKey
      if (shouldClearStore  || this.state.newSortKey) {
        const payload = {
          page: this.state.page.value,
          records: results,
          cacheKey,
          isFinalPage
        }
        resetRushRecords(payload)(this.props.dispatch)
      } else {
        this.props.dispatch(addPage(this.state.page.value, results, isFinalPage))
      }
    }

    this.setState({ shouldUpdatePage: false, newSortKey: false })
  }

  async fetchAllRecords() {
    const { sortKey, filterString } = this.state
    const {rushRecords} = this.props
    const {results, cacheKey} = await fetchGet(rushStatsEndpoint, [sortKey, filterString])

    this.props.dispatch(addAllRecordsJson(results))

    const shouldClearStore = cacheKey != rushRecords.cacheKey
      if (shouldClearStore) {
        const page = this.state.page.value
        const pageStart = page * defaultPageSize
        const pageResults = results.slice(pageStart, pageStart + defaultPageSize)
        const payload = {
          page,
          records: pageResults,
          cacheKey,
          isFinalPage
        }
        resetRushRecords(payload)(this.props.dispatch)
      }

    return results
  }

  onInputChange(event) {
    this.setState({
      filterString: {key: 'filterString', value: event.target.value}
    });
  }

  async onSortChange(sortKey) {
    if (sortKey != this.state.sortKey.value) {
      this.setState({
        page: {key: 'page', value: 0},
        sortKey: {key: 'sortKey', value: sortKey},
        newSortKey: true
      })
    }
  }

  onSearch() {
    this.setState({
      shouldUpdatePage: true,
      page: {key: 'page', value: 0}
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
    const allRushRecords = this.props.rushRecords.allRushRecords || await this.fetchAllRecords()
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
    const Records = rushRecords && rushRecords[page] && rushRecords[page].records && rushRecords[page].records.map(record =>
      <li key={record.Player}>
        <Record
          player={record.Player}
          team={record.Team}
          position={record.Pos}
          rushingAttemptsAverage={record.Att_G}
          rushingAttempts={record.Att}
          yards={record.Yds}
          averageRushingYards={record.Avg}
          rushingYardsPerGame={record.Yds_G}
          totalRushingTouchdowns={record.TD}
          longestRush={record.Lng}
          rushingFirstDowns={record.first}
          rushingFirstDownsPercentage={record.firstPercent}
          twentyPlusYardsEach={record.twentyPlus}
          fortyPlusYardsEach={record.fortyPlus}
          rushingFumbles={record.FUM}
        />
      </li>);

      return (
        <div className="page">
          <h1> NFL Rush Records </h1>
          <input type="text" id="fname" name="fname" placeholder="Search for a player..." onChange={this.onInputChange.bind(this)}></input>
          <button className="search-button" onClick={this.onSearch.bind(this)}> Search </button>
          <div className="toolbar"> Sort By: 
            <div>
              <span>
                <button className="order-by-button" onClick={() => this.onSortChange('Yds')}> Total Rushing Yards </button>
                <button className="order-by-button" onClick={() => this.onSortChange('Lng')}> Longest Rush </button>
                <button className="order-by-button" onClick={() => this.onSortChange('TD')}> Total Rushing Touchdowns </button>
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
          {Records}
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