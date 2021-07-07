import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import "./MarkDoneModal.css";
import { Modal, Button } from "antd";
// import moment from "moment";
import {
  getProjectDetails,
  markProjectAsDone
} from "../../../../actions/projects";

class ProjectDoneModal extends Component {
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

    // var currentDate = new Date();
    // var completed_date = moment(currentDate).format("YYYY-MM-DD");

    this.props.markProjectAsDone(this.props.project.id, true);

    // const onClick = this.props.onClick;
    // if (onClick) {
    //   onClick(e);
    // }
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
          Mark As Complete
        </Button>

        <Modal
          title={`Do You want to complete this Project ${this.props.project.name}`}
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

export default connect(null, { getProjectDetails, markProjectAsDone })(
  ProjectDoneModal
);
