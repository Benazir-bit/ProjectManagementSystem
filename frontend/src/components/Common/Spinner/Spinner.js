import React, { Component, Fragment } from "react";
import "./Spinner.css";
// import DefaultImange from "../../../../static/frontend/img/pic.png";
class Spinner extends Component {
  render() {
    // const antIcon = <Icon type="loading" style={{ fontSize: 36 }} />;

    return (
      <Fragment>
        <div className="loading">
          {/* <img src={DefaultImange} id="spinImg" /> */}
          <div className="spin spinner" />
        </div>
      </Fragment>
    );
  }
}

export default Spinner;
