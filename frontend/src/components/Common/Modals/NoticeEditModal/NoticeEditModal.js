import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Form, Modal, Input, DatePicker, Checkbox } from "antd";
import { updateNotice, getNoticeDetails } from "../../../../actions/notice";

import moment from "moment";

class NoticeEditModal extends React.Component {
  state = {
    visible: false,
    confirmLoading: false,
    important: false,
    notice_id: "",
    data: [],
    expired_date: "",
    created_date: "",
    value: []
  };
  componentDidMount() {
    this.props.onRef(this);
  }

  onChange = e => {
    this.setState({
      important: !this.state.important
    });
  };
  showModal(id) {
    this.props.getNoticeDetails(id);
    this.setState({
      visible: true,
      notice_id: id,
      data: [],
      created_date: "",
      expired_date: "",
      value: []
    });
  }
  handleCancel = () => {
    this.setState({
      visible: false,
      data: [],
      created_date: "",
      expired_date: "",
      value: []
    });
  };

  handleCreate = () => {
    const { form } = this.props;

    form.validateFields(err => {
      if (err || !this.state.created_date || !this.state.expired_date) {
        return null;
      } else {
        const {
          title,
          body,
          created_on,
          expires_on,
          important
        } = form.getFieldsValue();

        console.log(
          this.state.notice_id,
          title,
          body,
          created_on.format(),
          expires_on.format(),
          this.state.important
        );

        this.props.updateNotice(
          this.state.notice_id,
          title,
          body,
          created_on.format(),
          expires_on.format(),
          this.state.important
        );
        //this.state.value = [];
        form.resetFields();
        this.setState({
          visible: false
        });
      }
    });
  };

  componentDidUpdate(prevProps) {
    if (this.props.notice) {
      if (prevProps.notice != this.props.notice) {
        this.setState({
          created_date: this.props.notice.created_on,
          expired_date: this.props.notice.expires_on,
          important: this.props.notice.important
        });
      }
    }
  }

  render() {
    // console.log(this.props.notice, "this.props.notice");
    if (!this.props.notice) {
      return null;
    }

    // const { data, fetching } = this.state;
    let today = new Date();
    const { form, notice } = this.props;
    const { getFieldDecorator } = form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 }
      }
    };

    return (
      <Fragment>
        <Modal
          visible={this.state.visible}
          maskClosable={false}
          width={768}
          title="Update Notice"
          okText="Update"
          onCancel={this.handleCancel}
          onOk={this.handleCreate}
          okType={"primary"}
          destroyOnClose={true}
        >
          <br />
          <Form {...formItemLayout} className={"formEdit"}>
            <Form.Item label="Notice Title:" className={"formLabel"}>
              {getFieldDecorator("title", {
                initialValue: this.props.notice.title,
                rules: [
                  { required: true, message: "Please Enter Notice Title!" }
                ]
              })(<Input />)}
            </Form.Item>

            <Form.Item label="Details:" className={"formLabel"}>
              {getFieldDecorator("body", {
                initialValue: this.props.notice.body,
                rules: [
                  { required: true, message: "Please Enter Notice Detail!" }
                ]
              })(<Input />)}
            </Form.Item>

            <Form.Item label="Created On" className={"formLabel"}>
              {getFieldDecorator("created_on", {
                initialValue: moment(this.state.created_date)
              })(
                <DatePicker
                  format="DD MMM, YYYY, hh:mm a"
                  initialValue={moment(this.state.created_date)}
                  disabled
                  showTime={{
                    user12hours: true
                  }}
                />
              )}
            </Form.Item>

            <Form.Item label="Expires On" className={"formLabel"}>
              {getFieldDecorator("expires_on", {
                initialValue: moment(this.state.expired_date),
                rules: [
                  { required: true, message: "Please Enter Expired Date!" }
                ]
              })(
                <DatePicker
                  disabledDate={d => !d || d.isBefore(today)}
                  format="DD MMM, YYYY, hh:mm a"
                  // initialValue={moment(this.state.expired_date)}
                  showTime={{
                    user12hours: true
                  }}
                />
              )}
            </Form.Item>

            <Form.Item>
              {getFieldDecorator("important", {
                rules: [{ required: false }]
              })(
                <center>
                  <Checkbox
                    checked={this.state.important}
                    onChange={this.onChange}
                  >
                    Important
                  </Checkbox>
                </center>
              )}
            </Form.Item>
          </Form>
        </Modal>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  user: state.auth.user,
  notice: state.notice.notice
});

// const WrappedBoardNotice = Form.create()(NoticeEditModal);
export default connect(mapStateToProps, { updateNotice, getNoticeDetails })(
  NoticeEditModal
);
