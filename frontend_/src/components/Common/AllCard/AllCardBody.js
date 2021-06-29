import React, { Component, Fragment } from "react";
import AllCardHead from "../../Common/AllCard/AllCardHead";
import "./AllCard.css";

class AllCardBody extends Component {
  static defaultProps = {
    childDiv: "card-body table-responsive"
  };
  render() {
    return (
      <Fragment>
        <div className="card" id={this.props.id}>
          <AllCardHead
            cardHeader="card-title"
            cardTitle={this.props.cardTitle}
            extras={this.props.addextra}
          />
          <div id={this.props.BodyId} className={this.props.childDiv}>
            {this.props.children}
          </div>
          <br />
        </div>
      </Fragment>
    );
  }
}
export default AllCardBody;
