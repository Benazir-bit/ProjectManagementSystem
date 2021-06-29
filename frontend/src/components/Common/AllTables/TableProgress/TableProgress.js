import React, { Component, Fragment } from "react";
import { Progress } from "antd";
import "./TableProgress.css";
class TableProgress extends Component {
  render() {
    return (
      <Fragment>
        <div className="TableProgress">
          <Progress
            strokeLinecap="square"
            percent={this.props.percent}
            id={this.props.id}
            strokeColor={this.props.color}
          />
        </div>
      </Fragment>
    );
  }
}
export default TableProgress;
