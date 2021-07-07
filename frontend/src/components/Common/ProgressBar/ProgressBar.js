import React, { Component } from "react";
import "./ProgressBar.css";
// import { stringify } from "querystring";
class ProgressBar extends Component {
  render() {
    const strwidth = (this.props.value * 10).toString().concat("%");
    return (
      <div className="row">
        <div className="col-sm-3" id="progress_fix">
          <p id="emp_profile_kpi">{this.props.ProgressTag}</p>
        </div>
        <div className="col-sm-9" id="profile_kpi_progress">
          <div className="progress" id={this.props.id}>
            <div
              className={this.props.barclassName}
              role="progressbar"
              aria-valuenow={this.props.value}
              aria-valuemin="0"
              aria-valuemax={this.props.max}
              style={{ width: strwidth }}
            >
              <b>{this.props.value}</b>
            </div>
          </div>
          <br />
        </div>
      </div>
    );
  }
}
export default ProgressBar;
