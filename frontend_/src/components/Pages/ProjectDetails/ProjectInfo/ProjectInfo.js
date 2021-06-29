import React, { Component, Fragment } from "react";

import AllCardHead from "../../../Common/AllCard/AllCardHead";
import AllCardBody from "../../../Common/AllCard/AllCardBody";
import ProjectInfoTable from "../ProjectInfoTable/ProjectInfoTable";
import { Card, Skeleton } from "antd";
import "./ProjectInfo.css";
import ProjectDetailsPie from "../ProjectDetailsPie/ProjectDetailsPie";

class ProjectInfo extends Component {
  render() {
    const { project } = this.props;
    return (
      <Fragment>
        <AllCardBody
          BodyId="grp_info_table"
          cardTitle={"Project Overview"}
          cardHeight="dash_table_height_grp"
        >
          <div
            className="row"
            style={{ marginLeft: "0px", marginRight: "0px" }}
          >
            <div className="col-sm-12 col-md-12 col-xs-12 col-lg-6">
              <Card
                title="Details"
                style={{ width: "auto" }}
                id="DetailsCard"
                // className="col-sm-5 col-md-5 col-xs-12"
              >
                {project ? (
                  <Fragment>
                    <p>{project.details.details}</p>
                    <ProjectInfoTable project={project} />
                  </Fragment>
                ) : (
                  <Skeleton active loading={true} paragraph={false} />
                )}
              </Card>
              {/* <br /> */}
            </div>
            <div className="col-sm-12 col-md-12 col-xs-12 col-lg-6">
              <Card
                title="Project Status"
                style={{ width: "auto", height: "530px" }}
              >
                {project ? (
                  <ProjectDetailsPie type="project" id={project.details.id} />
                ) : null}
              </Card>
            </div>
          </div>
        </AllCardBody>
      </Fragment>
    );
  }
}
export default ProjectInfo;
