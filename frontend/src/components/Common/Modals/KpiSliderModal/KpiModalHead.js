import React, { Fragment } from "react";
import "./KpiSliderModal.css";
import moment from "moment";
class KpiModalHead extends React.Component {
  render() {
    return (
      <Fragment>
        <div className="modalheader" id="kpi_modal_head">
          <h5>
            <b>Employee:&nbsp;</b>
            {this.props.kpi.employee.full_name}
          </h5>
          <h5>
            <b>Task:&nbsp;</b>
            {this.props.kpi.task_name}
          </h5>
          <h5>
            <b>Rated by:&nbsp;</b>
            {this.props.kpi.rated_by.full_name}
          </h5>
          <h5>
            <b>Rated on:&nbsp;</b>
            {moment(this.props.kpi.created).format("DD MMM, YYYY")}
          </h5>
        </div>
      </Fragment>
    );
  }
}
export default KpiModalHead;
