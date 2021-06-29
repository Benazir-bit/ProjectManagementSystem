import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import ImageSmall from "../../../Common/ImageSmall/ImageSmall";
import { Skeleton } from "antd";
import "./GroupInfoTable.css";

class GroupInfoTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fetchingData: true
    };
  }
  componentDidMount() {
    this.setState({ fetchingData: true });
  }

  render() {
    // if (!this.props.group) {
    //   return null;
    // }
    // const fetchingData = this.props.fetchingData;
    return (
      <Fragment>
        <table
          className="table table-hover GrpInfoTable"
          style={{ marginBottom: "30px", fontSize: "13px" }}
        >
          <tbody>
            <tr>
              <td>
                <b>Group</b>
              </td>
              <td>
                {this.props.group ? (
                  this.props.group.name
                ) : (
                  <Skeleton active loading={true} paragraph={false} />
                )}
              </td>
            </tr>

            <tr>
              <td>
                <b>Team Leader</b>
              </td>
              <td>
                {this.props.group ? (
                  this.props.group.teamleader ? (
                    this.props.group.teamleader.teamleaders.map(profile => (
                      <Link
                        key={profile.profile.user}
                        to={`/profile/${profile.profile.user}`}
                      >
                        <ImageSmall
                          clsattr={"img-circle"}
                          altname={profile.profile.full_name}
                          srcfile={profile.profile.image}
                        />
                      </Link>
                    ))
                  ) : null
                ) : (
                  <Skeleton avator active loading={true} paragraph={false} />
                )}
              </td>
            </tr>

            <tr>
              <td>
                <b>Total Members</b>
              </td>
              <td>
                {this.props.group ? (
                  this.props.group.user_set.length
                ) : (
                  <Skeleton avator active loading={true} paragraph={false} />
                )}
              </td>
            </tr>
            <tr>
              <td>
                <b>Ongoing Projects</b>
              </td>

              <td>
                {this.props.group ? (
                  this.props.group.project_set.length
                ) : (
                  <Skeleton avator active loading={true} paragraph={false} />
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </Fragment>
    );
  }
}
export default GroupInfoTable;
