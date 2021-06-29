import React, { Component, Fragment } from "react";
import "./AllCard.css";

class IssueCardHeader extends Component {
  render() {
    return (
      <Fragment>
        <div
          id={this.props.issuehead}
          className="card-header card-header-warning"
        >
          <h4 className="card-title">{this.props.cardTitle}</h4>
        </div>
      </Fragment>
    );
  }
}
export default IssueCardHeader;
