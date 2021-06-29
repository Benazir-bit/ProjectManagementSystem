import React, { Component, Fragment } from "react";
import { connect } from "react-redux";

import { Skeleton } from "antd";

class TaskInfo extends Component {
  static defaultProps = {
    overview: {
      ongoing_tasks: 0,
      paused_tasks: 0,
      not_started_tasks: 0,
      waiting_for_review_tasks: 0
    }
  };
  // componentDidMount() {
  //   const type = this.props.type;
  //   const id = this.props.id;
  //   this.props.getTypeTaskOverview(type, id);
  // }
  render() {
    return (
      <Fragment>
        <table className="table table-hover taskinfotable">
          <tbody>
            <tr></tr>
            <tr>
              <td>Ongoing</td>
              <td>
                {this.props.overview ? (
                  this.props.overview.ongoing_tasks
                ) : (
                  <Skeleton active loading={true} paragraph={false} />
                )}
              </td>
            </tr>
            <tr>
              <td>Not Started</td>
              <td>
                {this.props.overview ? (
                  this.props.overview.not_started_tasks
                ) : (
                  <Skeleton active loading={true} paragraph={false} />
                )}
              </td>
            </tr>
            <tr>
              <td>Paused</td>
              <td>
                {this.props.overview ? (
                  this.props.overview.paused_tasks
                ) : (
                  <Skeleton active loading={true} paragraph={false} />
                )}
              </td>
            </tr>
            <tr>
              <td>Waiting For Review</td>
              <td>
                {this.props.overview ? (
                  this.props.overview.waiting_for_review_tasks
                ) : (
                  <Skeleton active loading={true} paragraph={false} />
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  overview: state.taskoverview.overview
});
export default connect(mapStateToProps)(TaskInfo);
