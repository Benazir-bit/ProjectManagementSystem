import React, { Fragment, Component } from "react";
import { connect } from "react-redux";
import { getUserAvgKPI } from "../../../../actions/profile";
import TitleHeader from "../../../Common/TitleHeader/TitleHeader";
import AvgKPIGroup from "../AvgKPIGroup/AvgKPIGroup";
import CircleProgress from "../../../Common/CircleProgress/CircleProgress";
import NoData from "../../../Common/NoData/NoData";
import "./ProfileKpi.css";

class ProfileKpi extends Component {
  componentDidMount() {
    const today = new Date(),
      date = today.getFullYear();
    this.props.getUserAvgKPI(this.props.profile.user, date);
  }
  render() {
    if (!this.props.avg_kpi) {
      return null;
    }
    return (
      <Fragment>
        <TitleHeader title={"Employee KPI"} title_color={"#337ab7"} />
        {this.props.avg_kpi.overall_kpi !== null ? (
          <Fragment>
            <AvgKPIGroup avg_kpi={this.props.avg_kpi} />
            <div className="col-sm-5" id="kpiProgress">
              <br />
              <CircleProgress avg_kpi={this.props.avg_kpi.overall_kpi} />
            </div>
          </Fragment>
        ) : (
          <NoData />
        )}
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  avg_kpi: state.profile.avg_kpi
});
export default connect(
  mapStateToProps,
  { getUserAvgKPI }
)(ProfileKpi);
