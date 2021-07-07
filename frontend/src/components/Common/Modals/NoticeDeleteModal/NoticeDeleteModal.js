import React, { Component, Fragment } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import "./NoticeDeleteModal.css";
import { deleteNotice, getNoticeDetails } from "../../../../actions/notice";
import { deleteComplete } from "../../../../actions/modal";
import { Modal } from "antd";

class NoticeDeleteModal extends Component {
  state = { visible: false, confirmLoading: false, notice_id: "" };

  componentDidMount() {
    this.props.onRef(this);
  }

  showModal(id) {
    this.props.getNoticeDetails(id);
    this.setState({
      visible: true,
      notice_id: id
    });
  }

  handleOk = e => {
    this.setState({
      confirmLoading: true
    });
    this.props.deleteNotice(this.props.notice.id);
  };

  handleCancel = e => {
    this.setState({
      visible: false
    });
  };
  // onchange = e => {
  //   console.log(this.props.notice, "okkkay");
  //   if (e.target.value === this.props.notice) {
  //     this.setState({
  //       disabled: false
  //     });
  //   } else {
  //     this.setState({
  //       disabled: true
  //     });
  //   }
  // };

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
        <Modal
          title="Delete Notice"
          visible={this.state.visible}
          onOk={this.handleOk}
          okType={"danger"}
          onCancel={this.handleCancel}
          okButton={this.handleOk}
          confirmLoading={this.state.confirmLoading}
          maskClosable={false}
          destroyOnClose={true}
        >
          <h5>Do You really want to delete this notice?</h5>
          <br />
          {/* <Input id="DeleteNoticeInput" /> */}
        </Modal>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  success: state.modal.success,
  notice: state.notice.notice
});
export default connect(
  mapStateToProps,
  { deleteNotice, deleteComplete, getNoticeDetails }
)(NoticeDeleteModal);
