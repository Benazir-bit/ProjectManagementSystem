import React, { Component, Fragment } from "react";
import CommonTable from "../../../Common/AllTables/CommonTable";
import AllCardBody from "../../../Common/AllCard/AllCardBody";
import { Link } from "react-router-dom";
import { Badge, Skeleton } from "antd";
import "./CurrentTask.css";
class CurrentTask extends Component {
  render() {
    let task_list = [];
    if (!this.props.tasks) {
      for (let i = 0; i < 3; i++) {
        let task_object = {
          "Task Name": (
            <Skeleton active loading={true} paragraph={false}></Skeleton>
          ),
          Project: (
            <Skeleton active loading={true} paragraph={false}></Skeleton>
          ),
          "Due Date": (
            <Skeleton active loading={true} paragraph={false}></Skeleton>
          ),
          "Remaining Days": (
            <Skeleton active loading={true} paragraph={false}></Skeleton>
          ),
          Status: <Skeleton active loading={true} paragraph={false}></Skeleton>,
          Issues: <Skeleton active loading={true} paragraph={false}></Skeleton>
        };
        task_list.push(task_object);
      }
    } else {
      {
        this.props.tasks.map(task => {
          let task_object = {
            "Task Name": (
              <Link to={`task-details/${task.id}`}>{task.name}</Link>
            ),

            Project: (
              <Link to={`/project-details/${task.project}`}>
                {task.project_name}
              </Link>
            ),
            "Due Date": task.deadline,

            "Remaining Days": task.time_remaining,
            Status: task.status,
            Issues: (
              <Badge
                count={task.issue_count}
                showZero
                style={{
                  marginLeft: "12px",
                  marginTop: "5px",
                  WebkitBoxShadow: "none",
                  backgroundColor: task.issue_count == 0 ? "#52c41a" : "#d9534f"
                }}
              />
            )
          };
          task_list.push(task_object);
        });
      }
    }
    var tableData = {
      columns: [
        "Task Name",
        "Project",
        "Due Date",
        "Remaining Days",
        "Status",
        "Issues"
      ],
      rows: task_list
    };

    return (
      <Fragment>
        <AllCardBody
          cardTitle={"Current Tasks"}
          addextra={
            <Link
              to={`/completedtasks/${this.props.user.id}`}
              style={{ float: "right", fontSize: "12px", color: "#000e24" }}
            >
              View All Tasks
            </Link>
          }
        >
          <CommonTable
            clsattr={"table dashTaskTable"}
            data={tableData}
            class_div={"dashboard_task_table"}
          />
        </AllCardBody>
      </Fragment>
    );
  }
}
export default CurrentTask;
