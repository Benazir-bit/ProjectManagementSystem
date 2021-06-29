import React, { Component, Fragment } from "react";

import "./AllCard.css";

class CardBodyOnly extends Component {
  render() {
    return (
      <Fragment>
        <div className="card" id={this.props.id}>
          <div id={this.props.BodyId} className="card-body table-responsive">
            {this.props.children}
          </div>
        </div>
      </Fragment>
    );
  }
}
export default CardBodyOnly;
