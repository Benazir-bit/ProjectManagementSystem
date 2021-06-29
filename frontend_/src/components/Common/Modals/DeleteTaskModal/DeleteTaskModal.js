import React, { Component, Fragment } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import "./DeleteTaskModal.css";
import { Modal, Button, Input } from "antd";
import { deleteTask } from "../../../../actions/task";
import { deleteComplete } from "../../../../actions/modal";

class DeleteTaskModal extends Component {
  state = { visible: false, confirmLoading: false };

  showModal = () => {
    this.setState({
      visible: true,
      disabled: true
    });
  };

  handleOk = e => {
    this.setState({
      confirmLoading: true
    });
    this.props.deleteTask(this.props.task.id);
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
    if (this.props.success) {
      this.setState({
        visible: false,
        confirmLoading: false
      });
      this.props.deleteComplete();
      return <Redirect to="/" />;
    }
    return (
      <Fragment>
        <Button type="danger" id="DeleteModalBtn" onClick={this.showModal}>
          Delete Task
        </Button>
        <Modal
          title="Do you really want to delete the task?"
          visible={this.state.visible}
          onOk={this.handleOk}
          okType={"danger"}
          onCancel={this.handleCancel}
          okButtonProps={{ disabled: this.state.disabled }}
          confirmLoading={this.state.confirmLoading}
          maskClosable={false}
          destroyOnClose={true}
        >
          <h5>
            Please enter the task name<b> {this.props.task.name} </b>
            below in order to confirm
          </h5>
          <br />
          {/* <input onChange={this.onchage} /> */}

          <Input
            onChange={this.onchage}
            placeholder="Confirm Task Name to Delete"
            id="DeleteTaskInput"
          />
        </Modal>
      </Fragment>
    );
  }
}
const mapStateToProps = state => ({
  success: state.modal.success
});
export default connect(
  mapStateToProps,
  { deleteTask, deleteComplete }
)(DeleteTaskModal);
