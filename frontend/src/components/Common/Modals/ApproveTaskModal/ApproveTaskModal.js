import React, { Component, Fragment } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { Modal, Button, Input } from "antd";
import { approveTask } from "../../../../actions/task";

class ApproveTaskModal extends Component {
  state = { visible: false };

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  handleOk = e => {
    const body = {
      id: this.props.task.id,
      requested: false,
      visible: false
    };
    this.props.approveTask(body);
  };

  handleCancel = e => {
    this.setState({
      visible: false
    });
  };
  onchage = e => {
    if (e.target.value === this.props.task.name) {
      this.setState({
        disabled: false
      });
    } else {
      this.setState({
        disabled: true
      });
    }
  };

  render() {
    return (
      <Fragment>
        <Button type="primary" id="TaskSubmitBtn" onClick={this.showModal}>
          Approve Task
        </Button>
        <Modal
          title="  "
          visible={this.state.visible}
          onOk={this.handleOk}
          okType={"primary"}
          onCancel={this.handleCancel}
          //okButtonProps={{ disabled: this.state.disabled }}
          maskClosable={false}
          destroyOnClose={true}
        >
          <h5>
            Do you want to approve task <b>{this.props.task.name}</b>?
          </h5>
        </Modal>
      </Fragment>
    );
  }
}

export default connect(null, { approveTask })(ApproveTaskModal);
