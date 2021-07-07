import React, { Component, Fragment } from "react";
// import ReactDOM from "react-dom";
import "./DetailCard.css";
// import TaskAssign from "./TaskAssign";
import { Skeleton } from "antd";

class DetailCard extends Component {
  render() {
    if (!this.props.task) {
      return (
        <Fragment>
          <div className="card" id={this.props.id}>
            <Skeleton active loading={true} paragraph={true} />
          </div>
        </Fragment>
      );
    }
    return (
      <Fragment>
        <div className="card" id={this.props.id}>
          <h4>
            <b>{this.props.detailHead}</b>
          </h4>
          <div className="card-body table-responsive" id={"taskDetailCard"}>
            <p id="task-paragraph">{this.props.task.details}</p>

            <br />
          </div>
          <div className="card-body table-responsive" id={"taskNotesCard"}>
            <h4>
              <b>{this.props.detailTag}</b>
            </h4>
            <p id="task-paragraph">{this.props.task.note}</p>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default DetailCard;
