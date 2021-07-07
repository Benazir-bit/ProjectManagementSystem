import React, { Component, Fragment } from "react";
// import { getTypeTaskOverview } from "../../../../actions/task";
import PieChartList from "../../../Common/PieChart/PieChartList/PieChartList";
import AllCardBody from "../../../Common/AllCard/AllCardBody";
import PieChartChart from "../../../Common/PieChart/PieChartChart/PieChatChart";
import "./CurrentTasksPie.css";
import { Badge, Skeleton } from "antd";
import NoDataPie from "../../../Common/NoDataPie/NoDataPie";

class CurrentTasksPie extends Component {
  render() {
    // if (!this.props.overview) {
    //   return null;
    // }

    const data = [
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
        <AllCardBody
          // BodyId={"paddingleft"}
          childDiv={`card-body dashboad-cardDiv ${this.props.overview
              ? this.props.overview.total_tasks > 0
                ? null
                : "overflow"
              : null
            }`}
          cardTitle={this.props.cardTitle}
          id="CurrentTaskPieDiv"
          addextra={
            <Skeleton
              avatar
              active
              loading={!this.props.overview}
              paragraph={false}
              title={false}
              className={"skeletonRoundbadge"}
            >
              <Badge
                count={
                  this.props.overview ? this.props.overview.total_tasks : null
                }
                overflowCount={5000}
                style={{
                  marginLeft: "12px",
                  marginTop: "-3px",
                  WebkitBoxShadow: "none"
                }}
              />
            </Skeleton>
          }
        >
          <div className="col-sm-12" id="pieList">
            <div className="col-sm-12 ">
              <PieChartList
                // overview={this.props.overview}
                type="user"
                data={data}
              // fetchingData={this.props.fetchingData}
              />
            </div>
          </div>

          <div
            className="col-sm-12 "
            style={{ height: "200px", marginTop: "20px" }}
          >
            {this.props.overview ? (
              this.props.overview.total_tasks > 0 ? (
                <PieChartChart
                  overview={this.props.overview}
                  id={this.props.id}
                />
              ) : (
                <NoDataPie />
              )
            ) : null}
          </div>

          {/*           
          <div className="col-sm-12" style={{ paddingRight: "29px" }}>
            <PieChartList
              overview={this.props.overview}
              type="user"
              data={data}
              fetchingData={this.props.fetchingData}
            />
          </div>
          {this.props.overview.total_tasks > 0 ? (
            <PieChartChart overview={this.props.overview} id={this.props.id} />
          ) : (
            <NoDataPie />
          )} */}
        </AllCardBody>
      </Fragment>
    );
  }
}

export default CurrentTasksPie;
