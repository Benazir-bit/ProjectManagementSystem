import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import ImageSmall from "../../../Common/ImageSmall/ImageSmall";
import { connect } from "react-redux";
import "./ProjectInfoTable.css";
import TableProgress from "../../../Common/AllTables/TableProgress";
import { Button, Row, Tooltip, Skeleton } from "antd";
import ProjectDoneModal from "../../../Common/Modals/MarkDoneModal/ProjectDoneModal";
import { extendClass } from "highcharts";
import MarkDoneModal from "../../../Common/Modals/MarkDoneModal/MarkDoneModal";

class ProjectInfoTable extends Component {
  render() {
    if (!this.props.project || !this.props.overview) {
      return <Skeleton active loading={true} paragraph={true} />;
    }
    const project = this.props.project.details;

    let projectDoneBtn;
    if (
      this.props.user.is_teamleader ||
      this.props.user.is_staff ||
      this.props.user.id == project.supervisor
    ) {
      if (this.props.overview.total_tasks == 0) {
        projectDoneBtn = (
          <Tooltip
            placement="bottom"
            title={"This Project does not contain any task"}
          >
            <Button disabled>Mark As Complete</Button>
          </Tooltip>
        );
      } else if (
        this.props.overview.completed_tasks == this.props.overview.total_tasks
      ) {
        projectDoneBtn = (
          <ProjectDoneModal
            project={project}
            style={{ marginBottom: "0px !important" }}
          />
        );
      } else {
        projectDoneBtn = (
          <Tooltip
            placement="bottom"
            title={"You are not allowed until all tasks are completed"}
          >
            <Button disabled>Mark As Complete</Button>
          </Tooltip>
        );
      }
    } else {
      projectDoneBtn = null;
    }

    // let projectKPIDone;
    // if (this.props.project.completed) {
    //   if (this.props.user.id == this.props.project.supervisor) {
    //     projectKPIDone = <p>hbe??</p>;
    //   } else {
    //     projectDoneBtn = null;
    //   }
    // }
    // console.log(this.props.project, "vvvvaaaaaaaaaaaaaaaaaaaaa");
    // console.log(this.props.project.completed, "aaaaaaaaaaaaaaaaaaaaa");
    return (
      <Fragment>
        <table
          className="table table-hover"
          style={{ marginBottom: "30px" }}
          id="ProjectInfoTable"
        >
          <tbody>
            <tr>
              <td id="member_grp">
                <b>Group</b>
              </td>
              <td id="grp_description">
                <Link to={`/group/${project.group}`}>{project.group_name}</Link>
              </td>
            </tr>
            <tr>
              <td id="member_grp">
                <b>Start Date</b>
              </td>
              <td id="grp_description">{project.started_date}</td>
            </tr>
            <tr>
              <td id="member_grp">
                <b>Due Date</b>
              </td>
              <td id="grp_description">{project.due_date}</td>
            </tr>
            <tr>
              <td id="member_grp">
                <b>Supervisor</b>
              </td>
              <td id="tooltip_designation">
                <div style={{ display: "inline-block" }}>
                  <Link to={`/profile/${project.supervisor}`}>
                    <ImageSmall
                      clsattr={"img-circle"}
                      altname={project.supervisor_user.full_name}
                      srcfile={project.supervisor_user.image}
                    />
                  </Link>
                </div>
                &nbsp;
                <div style={{ display: "inline-table" }}>
                  <Link to={`/profile/${project.supervisor}`}>
                    {project.supervisor_user.full_name}
                  </Link>
                </div>
              </td>
            </tr>
            <tr>
              <td id="member_grp">
                <b>Status</b>
              </td>
              <td id="progress-td">
                <TableProgress percent={project.proj_completeion_rate} />
              </td>
            </tr>

            {!project.completed ? (
              <tr>
                <td>{projectDoneBtn}</td>
              </tr>
            ) : (
              <tr>
                <td id="member_grp">
                  <b>Completed On</b>
                </td>
                <td id="grp_description">{project.completed_date}</td>
              </tr>
            )}
            {/* <tr>
              <td>{projectKPIDone}</td>
            </tr> */}
          </tbody>
        </table>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  overview: state.taskoverview.overview,
  user: state.auth.user
});
export default connect(mapStateToProps)(ProjectInfoTable);
