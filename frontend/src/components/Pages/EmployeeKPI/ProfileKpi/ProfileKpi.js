import React, { Fragment, Component } from "react";
import "./ProfileKpi.css";
import AvgKPIGroup from "../AvgKPIGroup/AvgKPIGroup";
import CircleProgress from "../../../Common/CircleProgress/CircleProgress";

class ProfileKpi extends Component {
  render() {
    if (!this.props.avg_kpi) {
      return null
    }
    //console.log(this.props.avg_kpi.overall_kpi);
    return (
      <Fragment>
        <AvgKPIGroup avg_kpi={this.props.avg_kpi} />
        <div className="col-sm-5" id="kpiProgress">
          <br />
          <CircleProgress avg_kpi={this.props.avg_kpi.overall_kpi} />
        </div>
      </Fragment>
    );
  }
}
export default ProfileKpi

