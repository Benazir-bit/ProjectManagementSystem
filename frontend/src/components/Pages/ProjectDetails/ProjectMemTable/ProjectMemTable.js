import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import ImageSmall from "../../../Common/ImageSmall/ImageSmall";
import BadgeStatus from "../../../Common/Badge/BadgeStatus";
import "./ProjectMemTable.css";
import { Skeleton } from "antd";
class ProjectMemTable extends Component {
  render() {
    if (!this.props.project) {
      return (
        <Fragment>
          <table className="table table-hover" id="ProjMemTable">
            <tbody>
              <tr>
                <td>
                  <Skeleton active loading={true} paragraph={false} />
                </td>
              </tr>
              <tr>
                <td>
                  <Skeleton active loading={true} paragraph={false} />
                </td>
              </tr>
              <tr>
                <td>
                  <Skeleton active loading={true} paragraph={false} />
                </td>
              </tr>
            </tbody>
          </table>
        </Fragment>
      );
    }
    let members = this.props.project.details.project_members;
    return (
      <Fragment>
        <table className="table table-hover" id="ProjMemTable">
          <tbody>
            {members.map(member => (
              <tr key={member.id}>
                <td>
                  <div style={{ display: "inline-block" }}>
                    <Link to={`/profile/${member.id}`}>
                      <ImageSmall
                        clsattr={"img-circle"}
                        width={"30"}
                        height={"30"}
                        altname={member.full_name}
                        srcfile={member.image}
                      />
                    </Link>
                  </div>

                  <div style={{ display: "inline-table" }}>
                    <Link to={`/profile/${member.id}`}>{member.full_name}</Link>
                    <br />
                    <small
                      className="text-muted"
                      style={{
                        paddingLeft: "0em",
                        marginLeft: "0px !important"
                      }}
                    >
                      {member.dsg}
                    </small>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Fragment>
    );
  }
}
export default ProjectMemTable;
