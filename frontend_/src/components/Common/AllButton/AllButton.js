import React, { Component } from "react";
import { Link } from "react-router-dom";

class AllButton extends Component {
  render() {
    return (
      <Link
        style={{ marginRight: this.props.margin }}
        to={this.props.btnhref}
        className={this.props.btnclassName}
        id={this.props.id}
      >
        <b>{this.props.name}</b>
      </Link>
    );
  }
}
export default AllButton;
