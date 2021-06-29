import React, { Component, Fragment } from "react";
import IssueCardHeader from "../../Common/AllCard/IssueCardHeader";
import "./AllCard.css";

class IssueCardBody extends Component {
  render() {
    return (
      <Fragment>
        <div className="card" id={this.props.id}>
          <IssueCardHeader
            issuehead="issueCardHeader"
            cardHeader="card-title"
            cardTitle={this.props.cardTitle}
          />
          <div id={this.props.BodyId} className="card-body table-responsive">
            {this.props.children}
          </div>
        </div>
      </Fragment>
    );
  }
}
export default IssueCardBody;
