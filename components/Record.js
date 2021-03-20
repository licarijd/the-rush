import React from "react";

const Record = (props) => {
  return (
    <>
      <div className="record">
        <h6> {`Player: ${props.player}`} </h6>
        <h6> {`Team: ${props.team}`} </h6>
        <h6> {`Position: ${props.position}`} </h6>
        <h6> {`Rushing Attempts Per Game Average: ${props.rushingAttemptsAverage}`} </h6>
        <h6> {`Rushing Attempts: ${props.rushingAttempts}`} </h6>
        <h6> {`Total Rushing Yards: ${props.yards}`} </h6>
        <h6> {`Rushing Average Yards Per Attempt: ${props.averageRushingYards}`} </h6>
        <h6> {`Rushing Yards Per Game: ${props.rushingYardsPerGame}`} </h6>
        <h6> {`Total Rushing Touchdowns: ${props.totalRushingTouchdowns}`} </h6>
        <h6> {`Longest Rush -- a T represents a touchdown occurred: ${props.longestRush}`} </h6>
        <h6> {`Rushing First Downs: ${props.rushingFirstDowns}`} </h6>
        <h6> {`Rushing First Downs Percentage: ${props.rushingFirstDownsPercentage}`} </h6>
        <h6> {`Rushing 20+ Yards Each: ${props.twentyPlusYardsEach}`} </h6>
        <h6> {`Rushing 40+ Yards Each: ${props.fortyPlus}`} </h6>
        <h6> {`Rushing Fumbles: ${props.rushingFumbles}`} </h6>
      </div>
    </>
  );
};

export default Record