import React from "react";
import { connect } from 'react-redux'
import { CSVLink } from "react-csv";

class CsvDownloadLink extends React.Component {

  render() {
    const { rushRecords } = this.props
    return (
      <CSVLink
        data={rushRecords.allRecords}
        filename={"rush_records.csv"}
        className="download-button"
        target="_blank"
      >
        Download Results
      </CSVLink>
    );
  }
};

const mapStateToProps = (state, props) => {
  return {
    rushRecords: state.rushRecords
  }
}

export default connect(mapStateToProps)(CsvDownloadLink)