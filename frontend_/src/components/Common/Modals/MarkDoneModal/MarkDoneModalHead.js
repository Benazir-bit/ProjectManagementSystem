import React, { Fragment } from "react";
import ReactDOM from "react-dom";
import "./MarkDoneModal.css";
import ImageSmall from "../../ImageSmall/ImageSmall";
class MarkDoneModalHead extends React.Component {
  render() {
    return (
      <Fragment>
        <div className="modalheader" id="kpi_modal_head">
          <h5>
            <b>Employee:</b>&nbsp;
            <ImageSmall
              clsattr="img-circle"
              altname={this.props.task.owner.full_name}
              srcfile={this.props.task.owner.image}
            />
            &nbsp;{this.props.task.owner.full_name}
          </h5>
          <h5>
            <b>Task:</b> {this.props.task.name}
          </h5>
        </div>
      </Fragment>
    );
  }
}
export default MarkDoneModalHead;
