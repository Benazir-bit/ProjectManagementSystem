import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import ImageSmall from "../../../Common/ImageSmall/ImageSmall";
import BadgeStatus from "../../../Common/Badge/BadgeStatus";
import "./MemberTable.css";
import { Icon, Skeleton } from "antd";

class MemberTable extends Component {
  render() {
    return (
      <Fragment>
        <table className="table table-hover" id="membersTable">
          {this.props.group ? (
            <tbody>
              {this.props.group.user_set.map(member => (
                <tr key={member.id}>
                  <td>
                    &emsp;
                    <div style={{ display: "inline-block" }}>
                      <Link to={`/profile/${member.id}`}>
                        <ImageSmall
                          clsattr={"img-circle"}
                          width={"30"}
                          height={"30"}
                          altname={"member.full_name"}
                          srcfile={member.image}
                        />
                      </Link>
                    </div>
                    <div style={{ display: "inline-table" }}>
                      <Link to={`/profile/${member.id}`}>
                        {member.full_name}
                      </Link>
                      &nbsp;
                      {/* {member.is_busy ? (
                        <Icon
                          type="thunderbolt"
                          theme="filled"
                          style={{ color: "#52c41a" }}
                        />
                      ) : (
                        <Icon
                          type="thunderbolt"
                          theme="outlined"
                          style={{ color: "#aaa" }}
                        />
                      )} */}
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
          ) : (
            <tbody>
              <tr>
                <td>
                  <Skeleton
                    loading={true}
                    active
                    avatar={{ size: 40, shape: "circle" }}
                    paragraph={false}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <Skeleton
                    loading={true}
                    active
                    avatar={{ size: 40, shape: "circle" }}
                    paragraph={false}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <Skeleton
                    loading={true}
                    active
                    avatar={{ size: 40, shape: "circle" }}
                    paragraph={false}
                  />
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </Fragment>
    );
  }
}
export default MemberTable;
