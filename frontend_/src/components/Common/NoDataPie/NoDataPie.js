import React, { Component, Fragment } from "react";
import "./NoDataPie.css";
class NoDataPie extends Component {
  render() {
    return (
      <Fragment>
        <div
          style={{
            position: "absolute",
            left: "21%"
          }}
        >
          <div className="c100 big">
            <span>0%</span>
            <br />
            <span id="txt_zero">{this.props.txt_zero}</span>
          </div>
        </div>
      </Fragment>
    );
  }
}
export default NoDataPie;
