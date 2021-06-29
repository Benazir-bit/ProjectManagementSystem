import React, { Component, Fragment } from "react";
import ProgressBar from "../../../Common/ProgressBar/ProgressBar";

class AvgKPIGroup extends Component {
  render() {
    return (
      <Fragment>
        <div className="col-sm-7">
          <br />
          <ProgressBar
            ProgressTag={"Skill"}
            barclassName={
              "progress-bar progress-bar-danger progress-bar-striped active"
            }
            value={this.props.avg_kpi.avg_kpi_dict.avg_skill}
            max={"10"}
          />
          <ProgressBar
            ProgressTag={"Attitude"}
            barclassName={
              "progress-bar progress-bar-warning progress-bar-striped active"
            }
            value={this.props.avg_kpi.avg_kpi_dict.avg_attitude}
            max={"10"}
          />
          <ProgressBar
            ProgressTag={"Motivation"}
            barclassName={
              "progress-bar progress-bar-info progress-bar-striped active"
            }
            value={this.props.avg_kpi.avg_kpi_dict.avg_motivation}
            max={"10"}
          />
          <ProgressBar
            ProgressTag={"Communication"}
            barclassName={
              "progress-bar progress-bar-success progress-bar-striped active"
            }
            value={this.props.avg_kpi.avg_kpi_dict.avg_communication}
            max={"10"}
          />
          <ProgressBar
            ProgressTag={"Time Management"}
            barclassName={
              "progress-bar progress-bar-warning progress-bar-striped active"
            }
            value={this.props.avg_kpi.avg_kpi_dict.avg_time_management}
            max={"10"}
          />
          <ProgressBar
            ProgressTag={"Reliability"}
            barclassName={
              "progress-bar progress-bar-danger progress-bar-striped active"
            }
            value={this.props.avg_kpi.avg_kpi_dict.avg_reliability}
            max={"10"}
          />
        </div>
      </Fragment>
    );
  }
}
export default AvgKPIGroup;
