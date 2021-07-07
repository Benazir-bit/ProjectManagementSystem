import React, { Component, Fragment } from "react";
import CommonTable from "../../../Common/AllTables/CommonTable";
import AllCardBody from "../../../Common/AllCard/AllCardBody";
import TableProgress from "../../../Common/AllTables/TableProgress/TableProgress";
import { Link } from "react-router-dom";
import "./MyProject.css";
import { Skeleton } from "antd";
import NoData from "../../../Common/NoData/NoData";

class MyProject extends Component {
  render() {
    let project_list = [];
    var tableData
    if (!this.props.projects) {
      for (let i = 0; i < 3; i++) {
        let proj_object = {
          "Project Name": (
            <Skeleton active loading={true} paragraph={false}></Skeleton>
          ),
          "Start Date": (
            <Skeleton active loading={true} paragraph={false}></Skeleton>
          ),
          "Due Date": (
            <Skeleton active loading={true} paragraph={false}></Skeleton>
          ),
          Progress: (
            <Skeleton active loading={true} paragraph={false}></Skeleton>
          )
        };
        project_list.push(proj_object);
      }
      tableData = {
        columns: ["Project Name", "Start Date", "Due Date", "Progress"],
        rows: project_list
      };
    } else {
      this.props.projects.map(project => {
        let proj_object = {
          "Project Name": (
            <Link to={`/project-details/${project.id}`}>{project.name}</Link>
          ),
          "Start Date": project.created_date,
          "Due Date": project.due_date,
          Progress: <TableProgress percent={project.proj_completeion_rate} />
        };
        project_list.push(proj_object);
      });
      tableData = {
        columns: ["Project Name", "Start Date", "Due Date", "Progress"],
        rows: project_list
      };
    }

    return (
      <Fragment>
        <AllCardBody
          cardTitle={this.props.title}
          addextra={
            <Link
              to={
                this.props.user
                  ? `/user/projects/all/${this.props.user.id}`
                  : `/group/projects/all/${this.props.id}`
              }
              style={{ float: "right", fontSize: "12px", color: "#000e24" }}
            >
              View All Projects
            </Link>
          }
        >
          {this.props.user_projects !== null ? (
            <CommonTable
              clsattr={"table dashboardCard"}
              data={tableData}
              class_div={"MyProjectDiv"}
            />
          ) : (
            <NoData />
          )}
        </AllCardBody>
      </Fragment>
    );
  }
}

export default MyProject;
