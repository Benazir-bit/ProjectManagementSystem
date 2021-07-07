import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import "./SubmitTaskModal.css";
import { Modal, Button } from "antd";
import moment from "moment";
import { getTaskDetails, submitTask } from "../../../../actions/task";

class SubmitTaskModal extends Component {
  state = { visible: false, confirmLoading: false };

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  handleOk = e => {
    this.setState({
      confirmLoading: true
    });

    var currentDate = new Date();
    var submit_date = moment(currentDate).format("YYYY-MM-DD");
    console.log(this.props.task, true, submit_date);
    if (this.props.task.owner.id === this.props.task.supervisor.id) {
      const body = JSON.stringify({
        id: this.props.task.id,
        submitted: true,
        completed: true
      });
      this.props.submitTask(body);
    } else {
      const body = JSON.stringify({
        id: this.props.task.id,
        submitted: true
      });
      this.props.submitTask(body);
    }

    const onClick = this.props.onClick;
    if (onClick) {
      onClick(e);
    }
  };
  handleCancel = e => {
    this.setState({
      visible: false
    });
  };
  render() {
    return (
      <Fragment>
        <Button id="TaskSubmitBtn" onClick={this.showModal}>
          Submit Task
        </Button>

        <Modal
          title={`Do You want to submit this Task ${this.props.task.name}`}
          // title="Do you want to submit the task?"
          visible={this.state.visible}
          onOk={this.handleOk}
          okType={"primary"}
          onCancel={this.handleCancel}
          confirmLoading={this.state.confirmLoading}
          maskClosable={false}
        >
          <h5>
            <b>Reminder:</b>&nbsp;You won't be able to cancel this submission
            after confirmation.
          </h5>
        </Modal>
      </Fragment>
    );
  }
}

//export default SubmitTaskModal;

const mapStateToProps = state => ({
  task: state.tasks.task
});

const mapActionsToProps = {
  getTaskDetails: getTaskDetails,
  submitTask: submitTask
};
export default connect(mapStateToProps, mapActionsToProps)(SubmitTaskModal);
