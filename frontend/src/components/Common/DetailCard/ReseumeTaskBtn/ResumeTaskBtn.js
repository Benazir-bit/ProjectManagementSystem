import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import moment from "moment";
import { getTaskDetails, resumeTask } from "../../../../actions/task";
import { Modal, Button } from "antd";

class ResumeTaskBtn extends Component {
  state = {
    visible: false,
    confirmLoading: false
  };

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  handleOk = e => {
    this.setState({ confirmLoading: true });
    var currentDate = new Date();
    var resumed_date = moment(currentDate).format("YYYY-MM-DD");
    console.log(this.props.task.id, true, resumed_date);
    this.props.resumeTask(this.props.task.id, true, false, resumed_date);
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
        <Button
          type="danger"
          id="TaskStartBtn"
          loading={this.state.loading}
          onClick={this.showModal}
        >
          Resume Task
        </Button>
        <Modal
          title={`Do You want to resume this Task ${this.props.task.name}?`}
          // title="Do you want to submit the task?"
          visible={this.state.visible}
          onOk={this.handleOk}
          okType={"primary"}
          onCancel={this.handleCancel}
          confirmLoading={this.state.confirmLoading}
          maskClosable={false}
        >
          <h5>
            <b>Reminder:</b>&nbsp;If You have any unresolved issues then you
            won't be able to submit this task until all the raised issues are
            solved after resuming the task.
          </h5>
        </Modal>
      </Fragment>
    );
  }
}
const mapStateToProps = state => ({
  task: state.tasks.task
});

const mapActionsToProps = {
  getTaskDetails: getTaskDetails,
  resumeTask: resumeTask
};
export default connect(
  mapStateToProps,
  mapActionsToProps
)(ResumeTaskBtn);
