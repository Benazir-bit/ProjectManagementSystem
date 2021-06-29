import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
// import { getTypeTaskOverview } from "../../../../actions/task";
import PieChartList from "../../../Common/PieChart/PieChartList/PieChartList";
import PieChartChart from "../../../Common/PieChart/PieChartChart/PieChatChart";
import NoDataPie from "../../../Common/NoDataPie/NoDataPie";
import "./TaskPieChart.css";

class TaskPieChart extends Component {
  // componentDidMount() {
  //   const type = this.props.type;
  //   const id = this.props.id;
  //   this.props.getTypeTaskOverview(type, id);
  // }
  render() {
    if (!this.props.overview) {
      return null;
    }
    const data = [
      {
        borderColor: "#fa8214",
        listName: "Total Tasks",
        number: this.props.overview.total_tasks
      },
      {
        borderColor: "#000e24",
        listName: "Completed",
        number: this.props.overview.completed_tasks
      },
      {
        borderColor: "#2c5ea9",
        listName: "Ongoing",
        number: this.props.overview.ongoing_tasks
      },
      {
        borderColor: "#3c92d3",
        listName: "Paused",
        number: this.props.overview.paused_tasks
      },
      {
        borderColor: "#7bcef3",
        listName: "Waiting For Review",
        number: this.props.overview.waiting_for_review_tasks
      },
      {
        borderColor: "#C6E2FF",
        listName: "Not Started Yet",
        number: this.props.overview.not_started_tasks
      }
    ];

    return (
      <Fragment>
        <div className="col-sm-4 col-xs-12" id="pieList">
          <PieChartList data={data} />
        </div>
        <div
          className="col-sm-8 col-xs-12"
          id="pieChart"
          style={{ height: "200px" }}
        >
          {this.props.overview.total_tasks > 0 ? (
            <PieChartChart overview={this.props.overview} />
          ) : (
            <NoDataPie />
          )}
        </div>

        {/* <div className="col-sm-12">
          <div className="col-sm-12 col-md-4 col-xs-12" id="pieTaskList">
            <PieChartList
              data={data}
              overview={this.props.overview}
              fetchingData={this.props.fetchingData}
              type="user"
            />
          </div>
          <div className="col-sm-12 col-md-8 col-xs-12" id="pieTaskChart">
            {this.props.overview.total_tasks > 0 ? (
              <PieChartChart overview={this.props.overview} />
            ) : (
              <NoDataPie />
            )}
          </div>
        </div> */}
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  overview: state.taskoverview.overview
});
export default connect(mapStateToProps)(TaskPieChart);
