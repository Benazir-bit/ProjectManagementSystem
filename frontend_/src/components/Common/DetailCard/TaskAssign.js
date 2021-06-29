import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import ImageSmall from "../../Common/ImageSmall/ImageSmall";
import {
  getTaskDetails,
  startTask,
  sendfeedback,
  submitTask
} from "../../../actions/task";

import { Button, Skeleton } from "antd";
import "./TaskAssign.css";
import RaiseIssueModal from "../Modals/RaiseIssueModal/RaiseIssueModal";
import SubmitTaskModal from "../Modals/SubmitTaskModal/SubmitTaskModal";
import TaskUpdateModal from "../Modals/TaskUpdateModal/TaskUpdateModal";
import DeleteTaskModal from "../Modals/DeleteTaskModal/DeleteTaskModal";
import ApproveTaskModal from "../Modals/ApproveTaskModal/ApproveTaskModal";
import StartTaskBtn from "./StartTaskBtn/StartTaskBtn";
import ResumeTaskBtn from "./ReseumeTaskBtn/ResumeTaskBtn";
import SendFeedbackModal from "../Modals/SendFeedbackModal/SendFeedbackModal";
import MarkDoneModal from "../Modals/MarkDoneModal/MarkDoneModal";
import DisableButton from "../AllButton/DisableButton/DisableButton";

class TaskAssign extends Component {
  // componentDidMount() {
  //   this.props.getTypeMembers("member-group", this.props.task.id);
  // }

  render() {
    if (!this.props.members || !this.props.task) {
      return (
        <Fragment>
          <div className="card" id={this.props.id}>
            <div className="card-body table-responsive" id={"taskAssignCard"}>
              <ul className="list-group">
                <li className="list-group-item">
                  <Skeleton active loading={true} paragraph={false} />
                </li>

                <li className="list-group-item">
                  <Skeleton active loading={true} paragraph={false} />
                </li>

                <li className="list-group-item">
                  <Skeleton active loading={true} paragraph={false} />
                </li>
              </ul>
            </div>
          </div>
        </Fragment>
      );
    }

    let countdown;
    if (!this.props.task.completed) {
      if (!this.props.task.overdue) {
        countdown = (
          <li className="list-group-item">
            <strong>Days Remaining:</strong>&nbsp;
            {this.props.task.time_remaining}&nbsp;Days
          </li>
        );
      } else {
        countdown = (
          <li className="list-group-item danger">
            <strong>Overdue:</strong> &nbsp;{this.props.task.time_remaining}
            &nbsp;Days
          </li>
        );
      }
    } else {
      countdown = null;
    }
    let taskModify;
    if (!this.props.task.completed) {
      if (
        this.props.user.id == this.props.task.supervisor.id ||
        this.props.user.is_teamleader ||
        this.props.user.is_staff
      ) {
        taskModify = (
          <Fragment>
            <li className="list-group-item" style={{ display: "flex" }}>
              {/* <div style={{ display: "inline-flex" }}> */}
              <TaskUpdateModal
                task={this.props.task}
                members={this.props.members}
              />
              &emsp;
              <DeleteTaskModal task={this.props.task} /> &emsp;
              {this.props.task.requested ? (
                <ApproveTaskModal task={this.props.task} />
              ) : null}
              {/* </div> */}
            </li>
          </Fragment>
        );
      } else {
        taskModify = null;
      }
    } else {
      taskModify = null;
    }

    let checktask;
    if (this.props.user.id == this.props.task.supervisor.id) {
      if (this.props.task.submitted && !this.props.task.completed) {
        checktask = (
          <Fragment>
            <li className="list-group-item">
              <div style={{ display: "inline-flex" }}>
                <SendFeedbackModal task={this.props.task} />
                &emsp;
                <MarkDoneModal task={this.props.task} />
              </div>
            </li>
          </Fragment>
        );
      } else if (this.props.task.owner.id == this.props.task.supervisor.id) {
        if (!this.props.task.started) {
          checktask = (
            <li className="list-group-item" style={{ display: "flex" }}>
              <div style={{ display: "inline-flex" }}>
                <StartTaskBtn task={this.props.task} />
              </div>
            </li>
          );
        } else if (!this.props.task.completed) {
          checktask = (
            <li className="list-group-item" style={{ display: "flex" }}>
              {this.props.task.unresolved_issues ? (
                <div style={{ display: "inline-flex" }}>
                  <RaiseIssueModal task={this.props.task} />
                  &emsp;
                  <DisableButton
                    task={this.props.task}
                    btnName={"Mark As Done"}
                  />
                </div>
              ) : (
                <div style={{ display: "inline-flex" }}>
                  <RaiseIssueModal task={this.props.task} />
                  &emsp;
                  <SubmitTaskModal task={this.props.task} />
                </div>
              )}
            </li>
          );

          if (this.props.task.paused) {
            checktask = (
              <li className="list-group-item" style={{ display: "flex" }}>
                <div style={{ display: "inline-flex" }}>
                  <ResumeTaskBtn task={this.props.task} />
                </div>
              </li>
            );
          } else if (this.props.task.resumed) {
            checktask = (
              <li className="list-group-item" style={{ display: "flex" }}>
                {this.props.task.unresolved_issues ? (
                  <div style={{ display: "inline-flex" }}>
                    <RaiseIssueModal task={this.props.task} />
                    &emsp;
                    <DisableButton
                      task={this.props.task}
                      btnName={"Mark As Done"}
                    />
                  </div>
                ) : (
                  <div style={{ display: "inline-flex" }}>
                    <RaiseIssueModal task={this.props.task} />
                    &emsp;
                    <SubmitTaskModal task={this.props.task} />
                  </div>
                )}
              </li>
            );
          }
        }
      }
    } else if (this.props.user.id == this.props.task.owner.id) {
      if (!this.props.task.requested) {
        if (!this.props.task.started) {
          checktask = (
            <li className="list-group-item" style={{ display: "flex" }}>
              <div style={{ display: "inline-flex" }}>
                <StartTaskBtn task={this.props.task} />
              </div>
            </li>
          );
        } else if (!this.props.task.submitted && !this.props.task.completed) {
          checktask = (
            <li className="list-group-item" style={{ display: "flex" }}>
              {this.props.task.unresolved_issues ? (
                <div style={{ display: "inline-flex" }}>
                  <RaiseIssueModal task={this.props.task} />
                  &emsp;
                  <DisableButton
                    task={this.props.task}
                    btnName={"Submit Task"}
                  />
                </div>
              ) : (
                <div style={{ display: "inline-flex" }}>
                  <RaiseIssueModal task={this.props.task} />
                  &emsp;
                  <SubmitTaskModal task={this.props.task} />
                </div>
              )}
            </li>
          );
          if (this.props.task.paused) {
            checktask = (
              <li className="list-group-item" style={{ display: "flex" }}>
                <div style={{ display: "inline-flex" }}>
                  <ResumeTaskBtn task={this.props.task} />
                </div>
              </li>
            );
          } else if (this.props.task.resumed) {
            checktask = (
              <li className="list-group-item" style={{ display: "flex" }}>
                {this.props.task.unresolved_issues ? (
                  <div style={{ display: "inline-flex" }}>
                    <RaiseIssueModal task={this.props.task} />
                    &emsp;
                    <DisableButton
                      task={this.props.task}
                      btnName={"Submit Task"}
                    />
                  </div>
                ) : (
                  <div style={{ display: "inline-flex" }}>
                    <RaiseIssueModal task={this.props.task} />
                    &emsp;
                    <SubmitTaskModal task={this.props.task} />
                  </div>
                )}
              </li>
            );
          }
        }
      }
    }

    return (
      <Fragment>
        <div className="card" id={this.props.id}>
          <div className="card-body table-responsive" id={"taskAssignCard"}>
            <ul className="list-group">
              {taskModify}
              {checktask}

              <li className="list-group-item">
                <strong>Assigned to: </strong>
                <Link to={`/profile/${this.props.task.owner.id}`}>
                  <ImageSmall
                    clsattr="img-circle"
                    altname={this.props.task.owner.full_name}
                    srcfile={this.props.task.owner.image}
                  />
                </Link>
                <Link to={`/profile/${this.props.task.owner.id}`}>
                  {this.props.task.owner.full_name}
                </Link>
              </li>

              <li className="list-group-item">
                <strong>Supervised by: </strong>
                <Link to={`/profile/${this.props.task.supervisor.id}`}>
                  <ImageSmall
                    clsattr="img-circle"
                    altname={this.props.task.supervisor.name}
                    srcfile={this.props.task.supervisor.image}
                  />
                </Link>
                <Link to={`/profile/${this.props.task.supervisor.id}`}>
                  {this.props.task.supervisor.full_name}
                </Link>
              </li>
              <li className="list-group-item">
                <strong>Created date:</strong>&nbsp;
                {this.props.task.created_date}
              </li>

              <li className="list-group-item">
                <strong>Started date:</strong>&nbsp;
                {this.props.task.started
                  ? this.props.task.started_date
                  : "Not Started"}
              </li>
              {this.props.task.completed ? (
                <li className="list-group-item">
                  <strong>Completed date:</strong>&nbsp;
                  {this.props.task.completed_date}
                </li>
              ) : null}
              <li className="list-group-item">
                <strong>Due date:</strong>&nbsp;
                {this.props.task.deadline}
              </li>
              {countdown}
              <li className="list-group-item">
                <strong>Status:</strong> {this.props.task.status}
              </li>

              <li className="list-group-item">
                <strong>Project:</strong>&nbsp;
                <Link to={`/project-details/${this.props.task.project}`}>
                  {this.props.task.project_name}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  task: state.tasks.task,
  members: state.member.members
});

const mapActionsToProps = {
  // getTaskDetails: getTaskDetails,
  // getTypeMembers: getTypeMembers,
  // startTask: startTask,
  // sendfeedback: sendfeedback,
  // submittask: submitTask
};
export default connect(mapStateToProps, mapActionsToProps)(TaskAssign);
