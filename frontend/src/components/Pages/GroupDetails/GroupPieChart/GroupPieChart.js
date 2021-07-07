import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
// import { getTypeTaskOverview } from "../../../../actions/task";
import PieChartList from "../../../Common/PieChart/PieChartList/PieChartList";
import PieChartChart from "../../../Common/PieChart/PieChartChart/PieChatChart";
import NoDataPie from "../../../Common/NoDataPie/NoDataPie";
import "./GroupPieChart.css";

class GroupPieChart extends Component {
  static defaultProps = { id: "pieList" };
  render() {
    // if (!this.props.overview) {
    //   return null;
    // }
    console.log(this.props.overview, "aaaaaaaasssssssss");
    const data = [
      {
        borderColor: "#fa8214",
        listName: "Total Tasks",
        number: this.props.overview ? this.props.overview.total_tasks : null
      },
      {
        borderColor: "#000e24",
        listName: "Completed",
        number: this.props.overview ? this.props.overview.completed_tasks : null
      },
      {
        borderColor: "#2c5ea9",
        listName: "Ongoing",
        number: this.props.overview ? this.props.overview.ongoing_tasks : null
      },
      {
        borderColor: "#3c92d3",
        listName: "Paused",
        number: this.props.overview ? this.props.overview.paused_tasks : null
      },
      {
        borderColor: "#7bcef3",
        listName: "Waiting For Review",
        number: this.props.overview
          ? this.props.overview.waiting_for_review_tasks
          : null
      },
      {
        borderColor: "#C6E2FF",
        listName: "Not Started Yet",
        number: this.props.overview
          ? this.props.overview.not_started_tasks
          : null
      }
    ];

    return (
      <Fragment>
        <div className="col-sm-12">
          <div className="col-sm-4 col-xs-12" id={this.props.id}>
            <PieChartList
              data={data}
              overview={this.props.overview}
            // fetchingData={this.state.fetchingData}
            />
          </div>
          <div
            className="col-sm-8 col-xs-12"
            id="pieChart"
            style={{ height: "235px" }}
          >
            {this.props.overview ? (
              this.props.overview.total_tasks > 0 ? (
                <PieChartChart
                  overview={this.props.overview}
                // fetchingData={this.state.fetchingData}
                />
              ) : (
                <NoDataPie />
              )
            ) : null
              // <Skeleton
              //   loading={true}
              //   active
              //   avatar={{ size: 180, shape: "circle" }}
              //   paragraph={false}
              //   title={{ width: 0 }}
              // />
            }
          </div>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  overview: state.taskoverview.overview
});
export default connect(mapStateToProps)(GroupPieChart);
