import React, { Component, Fragment } from "react";
import { Divider, Skeleton } from "antd";
import "./DetailCard.css";

class IssueDetailCard extends Component {
  render() {
    if (!this.props.issue) {
      return (
        <div className="card" id="card_details">
          <Skeleton active loading={true} paragraph={true} />
        </div>
      );
    }
    return (
      <Fragment>
        <div className="card" id="card_details">
          {/* <div className="card-body table-responsive"> */}
          <h4>
            <b>{this.props.detailHead}</b>
          </h4>
          <p
            id="task-paragraph"
            dangerouslySetInnerHTML={{ __html: this.props.issue.details }}
          />
        </div>

        {/* </div> */}
      </Fragment>
    );
  }
}

export default IssueDetailCard;
