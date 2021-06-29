import React, { Component, Fragment } from "react";
import AllCardBody from "../../../Common/AllCard/AllCardBody";
import ProjectMemTable from "../ProjectMemTable/ProjectMemTable";
import "./ProjectMembers.css";

class ProjectMembers extends Component {
  static defaultProps = {
    BodyId: "project_member_table"
  };
  render() {
    return (
      <Fragment>
        <AllCardBody BodyId={this.props.BodyId} cardTitle={"Members"}>
          <ProjectMemTable project={this.props.project} />
        </AllCardBody>
      </Fragment>
    );
  }
}
export default ProjectMembers;
