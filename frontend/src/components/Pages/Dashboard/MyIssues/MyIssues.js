import React, { Component, Fragment } from "react";
import { connect } from "react-redux";

import CommonTable from "../../../Common/AllTables/CommonTable";
import AllCardBody from "../../../Common/AllCard/AllCardBody";
import { Link } from "react-router-dom";
import { Badge, Skeleton } from "antd";
import "./MyIssues.css";
class MyIssues extends Component {
  render() {
    let issue_list = [];
    if (!this.props.issues) {
      for (let i = 0; i < 3; i++) {
        let issue_object = {
          "Issue Name": (
            <Skeleton active loading={true} paragraph={false}></Skeleton>
          ),
          "Task Name": (
            <Skeleton active loading={true} paragraph={false}></Skeleton>
          ),
          "Raised On": (
            <Skeleton active loading={true} paragraph={false}></Skeleton>
          ),
          "Total Comments": (
            <Skeleton active loading={true} paragraph={false}></Skeleton>
          )
        };
        issue_list.push(issue_object);
      }
    } else {
      {
        this.props.issues.map(issue => {
          let issue_object = {
            "Issue Name": (
              <Link to={`issue-details/${issue.id}`}>{issue.name}</Link>
            ),
            "Task Name": (
              <Link to={`/task-details/${issue.task}`}>{issue.task_name}</Link>
            ),
            "Raised On": issue.raised_date,
            "Total Comments": (
              <Badge
                count={issue.total_comments}
                showZero
                style={{
                  marginLeft: "12px",
                  marginTop: "5px",
                  WebkitBoxShadow: "none",
                  backgroundColor: "#52c41a"
                }}
              />
            )
          };
          issue_list.push(issue_object);
        });
      }
    }
    var tableData = {
      columns: ["Issue Name", "Task Name", "Raised On", "Total Comments"],
      rows: issue_list
    };
    return (
      <Fragment>
        <AllCardBody
          cardTitle={"My Issues"}
          addextra={
            <Link
              to={`/raised-issues/${this.props.user.id}`}
              style={{ float: "right", fontSize: "12px", color: "#000e24" }}
            >
              View All Issues
            </Link>
          }
        >
          <CommonTable
            clsattr={"table dashboardCard"}
            data={tableData}
            class_div={"dashboard_task_table"}
          />
        </AllCardBody>
      </Fragment>
    );
  }
}
const mapStateToProps = state => ({
  issues: state.issues.issues
});
export default connect(mapStateToProps)(MyIssues);
