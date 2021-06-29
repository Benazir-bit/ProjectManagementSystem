import React, { Component, Fragment } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import "./DeleteModal.css";
import { Modal, Button, Input } from "antd";
import { deleteProject } from "../../../../actions/projects";
import { deleteComplete } from "../../../../actions/modal";

class DeleteModal extends Component {
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
    this.props.deleteProject(this.props.id);
  };

  handleCancel = e => {
    this.setState({
      visible: false
    });
  };
  onchage = e => {
    if (e.target.value === this.props.project) {
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
          Delete Project
        </Button>
        <Modal
          title="Do you really want to delete the project?"
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
            Please enter the project name<b> {this.props.project} </b>
            below in order to confirm
          </h5>
          <br />
          <Input
            onChange={this.onchage}
            placeholder="Confirm Project Name to Delete"
            id="DeleteProjInput"
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
  { deleteProject, deleteComplete }
)(DeleteModal);
